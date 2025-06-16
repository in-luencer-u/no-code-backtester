"use client"

import { useState, useEffect } from "react"
import { Info, HelpCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

import type { IndicatorType, IndicatorLogic, IndicatorParams, IndicatorCondition } from "./types";
import type { IndicatorParameter, IndicatorMetadata, LogicOption } from "./indicator-metadata";
import { indicatorMetadata } from "./indicator-metadata";

// Extend IndicatorCondition for UI only (not in shared types)
type IndicatorConditionWithSecondary = IndicatorCondition & {
  secondaryIndicator?: {
    type: IndicatorType;
    params: IndicatorParams;
  };
};

interface IndicatorLogicEngineProps {
  condition: IndicatorConditionWithSecondary;
  onChange: (updatedCondition: IndicatorConditionWithSecondary) => void;
  onRemove?: () => void;
}

// Utility: Type guard for IndicatorType
function isIndicatorType(value: string): value is IndicatorType {
  return Object.keys(indicatorMetadata).includes(value);
}

// Utility: Get default indicator params for a type
const defaultIndicatorParams: IndicatorParams = { period: 14, source: "close" };

const defaultIndicatorMetadata: any = {
  defaultParams: { period: 14, source: "close" },
  defaultLogic: "less_than",
  logicOptions: [
    { value: "less_than", label: "Less Than" }
  ]
};

// Add type guard for option type
function isOptionObject(option: string | { value: string; label: string }): option is { value: string; label: string } {
  return typeof option === "object" && option !== null && "value" in option && "label" in option;
}

// Add type for select options
type SelectOption = string | { value: string; label: string };

const IndicatorLogicEngine: React.FC<IndicatorLogicEngineProps> = ({ condition, onChange, onRemove }) => {
  // Cast condition to extended type for UI logic
  const cond = condition as IndicatorConditionWithSecondary;

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const indicator = indicatorMetadata[condition.indicator] as IndicatorMetadata;
  const selectedLogic = indicator?.logicOptions.find(
    (option) => option.value === condition.logic
  ) as LogicOption | undefined;

  // Initialize parameters with proper typing
  useEffect(() => {
    if (indicator && !isInitialized) {
      const initialValues: Record<string, string | number | boolean> = {};
      Object.entries(indicator.parameters).forEach(([key, param]: [string, IndicatorParameter]) => {
        initialValues[key] = condition.params?.[key] ?? param.default;
      });

      onChange({
        ...condition,
        value:
          condition.value ||
          selectedLogic?.defaultValue?.toString() ||
          "0",
        params: {
          ...condition.params,
          ...initialValues,
        },
      });

      setIsInitialized(true);
    }
  }, [indicator, isInitialized, condition, onChange, selectedLogic?.defaultValue]);

  // Reset initialization when indicator changes
  useEffect(() => {
    setIsInitialized(false);
  }, [condition.indicator]);

  // Handle indicator change with type safety
  const handleIndicatorChange = (value: string) => {
    if (!isIndicatorType(value)) return;
    
    const indicatorType = value;
    const newIndicator = indicatorMetadata[indicatorType] || defaultIndicatorMetadata;
    onChange({
      ...condition,
      indicator: indicatorType,
      logic: (newIndicator.defaultLogic || newIndicator.logicOptions[0].value) as IndicatorLogic,
      params: { ...defaultIndicatorParams },
    });
  };

  // Type-safe logic change handler
  const handleLogicChange = (value: IndicatorLogic) => {
    if (!indicator.logicOptions.some(option => option.value === value)) return;

    // Create updated condition with new logic
    const updatedCondition = {
      ...condition,
      logic: value,
    };

    // Only initialize secondary indicator for moving averages (from metadata)
    const selectedLogicOption = indicator.logicOptions.find(opt => opt.value === value);
    if ((value.includes("crosses") || value.includes("above") || value.includes("below")) &&
        !updatedCondition.secondaryIndicator &&
        selectedLogicOption?.customInput &&
        MOVING_AVERAGE_INDICATORS.includes(condition.indicator)) {
      // Get first available moving average indicator from metadata
      const firstMA = MOVING_AVERAGE_INDICATORS[0];
      updatedCondition.secondaryIndicator = {
        type: firstMA as IndicatorType,
        params: {
          ...Object.entries(indicatorMetadata[firstMA].parameters).reduce<Record<string, any>>(
            (acc, [key, param]) => ({
              ...acc,
              [key]: param.default
            }),
            {}
          )
        }
      };
    }

    onChange(updatedCondition);
  };

  // Handle value changes safely
  const handleValueChange = (value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      onChange({
        ...condition,
        value: numericValue.toString(),
      });
    }
  };

  // Properly typed parameter change handler
  const handleParamChange = (paramName: string, value: string | number | boolean) => {
    const updatedParams = {
      ...condition.params,
      [paramName]: value,
    };
    onChange({
      ...condition,
      params: updatedParams,
    });
  };

  // Secondary indicator handling with type safety
  const handleSecondaryIndicatorTypeChange = (value: string) => {
    if (!isIndicatorType(value)) return;
    
    // Get metadata for the selected indicator type
    const metadata = indicatorMetadata[value];
    
    // Initialize all parameters with their default values
    const defaults = Object.entries(metadata.parameters).reduce<Record<string, any>>((acc, [key, param]) => {
      acc[key] = param.default;
      return acc;
    }, {});

    onChange({
      ...condition,
      secondaryIndicator: {
        type: value as IndicatorType,
        params: defaults // Use fresh defaults, don't merge with old params as they might not be compatible
      }
    });
  };

  const handleLogicParamChange = (paramName: string, value: string | number | boolean) => {
    if (!condition.secondaryIndicator) return;
    
    onChange({
      ...condition,
      secondaryIndicator: {
        type: condition.secondaryIndicator.type,
        params: {
          ...condition.secondaryIndicator.params,
          [paramName]: value
        }
      }
    });
  };
  

  if (!indicator) return null;

  // Separate standard and advanced parameters
  const standardParams = Object.entries(indicator.parameters).filter(([_, param]) => !param.advanced);
  const advancedParams = Object.entries(indicator.parameters).filter(([_, param]) => param.advanced);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="space-y-4">
                <h3 className="text-sm font-bold">Select Indicator</h3>

                <Select value={condition.indicator} onValueChange={handleIndicatorChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(indicatorMetadata)
                      .sort(([,a], [,b]) => a.name.localeCompare(b.name))
                      .map(([key, meta]) => (
                        <SelectItem key={key} value={key}>
                          {meta.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{indicator.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 px-2 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Standard Parameters */}
          {standardParams.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                {standardParams.map(
                  ([key, param]: [string, IndicatorParameter]) =>
                    (typeof param.showIf !== "function" || param.showIf(condition.params ?? {})) && (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor={key}>{param.name}</Label>
                          {param.description && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{param.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        {param.type === "select" ? (
                          <Select
                            value={String(condition.params?.[key] || param.default)}
                            onValueChange={(value) => handleParamChange(key, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(param.options as Array<string | { value: string | number; label: string }>)?.map((option) => (
                                typeof option === "string"
                                  ? <SelectItem key={option} value={option}>{option}</SelectItem>
                                  : <SelectItem key={String(option.value)} value={String(option.value)}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : param.type === "number" ? (
                          <Input
                            type="number"
                            id={key}
                            value={String(condition.params?.[key] || param.default)}
                            onChange={(e) => handleParamChange(key, Number(e.target.value))}
                          />
                        ) : param.type === "boolean" ? (
                          <Switch
                            id={key}
                            checked={Boolean(condition.params?.[key] ?? param.default)}
                            onCheckedChange={(checked) => handleParamChange(key, checked)}
                          />
                        ) : (
                          <Input
                            type="text"
                            id={key}
                            value={String(condition.params?.[key] || param.default)}
                            onChange={(e) => handleParamChange(key, e.target.value)}
                          />
                        )}
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {/* Advanced Parameters */}
          {advancedParams.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced-params">
                <AccordionTrigger className="text-sm font-medium">Advanced Parameters</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {advancedParams.map(([key, param]: [string, IndicatorParameter]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label>{param.name}</Label>
                          {param.description && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{param.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        {param.type === "select" ? (
                          <Select
                            value={String(condition.params?.[key] || param.default)}
                            onValueChange={(value) => handleParamChange(key, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(param.options as Array<string | { value: string | number; label: string }>)?.map((option) => (
                                typeof option === "string"
                                  ? <SelectItem key={option} value={option}>{option}</SelectItem>
                                  : <SelectItem key={String(option.value)} value={String(option.value)}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : param.type === "number" ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <Input
                                type="number"
                                value={String(condition.params?.[key] || param.default)}
                                onChange={(e) => handleParamChange(key, Number.parseFloat(e.target.value))}
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                className="w-full"
                              />
                              <span className="text-xs text-muted-foreground ml-2 w-12 text-right">
                                {condition.params?.[key] || param.default}
                              </span>
                            </div>
                            {param.min !== undefined && param.max !== undefined && (
                              <Slider
                                value={[Number(condition.params?.[key] || param.default)]}
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                onValueChange={(values) => handleParamChange(key, values[0])}
                              />
                            )}
                          </div>
                        ) : param.type === "boolean" ? (
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={Boolean(condition.params?.[key] ?? param.default)}
                              onCheckedChange={(checked) => handleParamChange(key, checked)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {Boolean(condition.params?.[key] ?? param.default) ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        ) : (
                          <Input
                            type="text"
                            value={String(condition.params?.[key] || param.default)}
                            onChange={(e) => handleParamChange(key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Logic Section */}
         
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Logic</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logic Dropdown */}
              <div className="space-y-2">
                <Label>Logic</Label>
                <Select value={condition.logic} onValueChange={handleLogicChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {indicator.logicOptions.map((option: LogicOption) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLogic?.description && (
                  <p className="text-sm text-muted-foreground">{selectedLogic.description}</p>
                )}
              </div>

              {/* Custom Logic Input */}
              {(
                (selectedLogic?.customInput && !MOVING_AVERAGE_INDICATORS.includes(condition.indicator)) ||
                (!MOVING_AVERAGE_INDICATORS.includes(condition.indicator) && (condition.logic === "crosses_above" || condition.logic === "crosses_below"))
              ) && (
                <div className="space-y-3 md:ml-14 md:w-full">
                  <Label className="block mb-1">{selectedLogic?.inputLabel || "Custom Value"}</Label>
                  <div className="flex flex-col gap-3">
                    <Input
                      type={selectedLogic?.valueType === "number" ? "number" : "text"}
                      value={condition.value || selectedLogic?.defaultValue?.toString() || ""}
                      onChange={(e) => handleValueChange(e.target.value)}
                      min={selectedLogic?.min}
                      max={selectedLogic?.max}
                      step={selectedLogic?.step}
                      className="w-full"
                    />
                    {selectedLogic?.valueType === "number" && selectedLogic?.min !== undefined && selectedLogic?.max !== undefined && (
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[Number(condition.value || selectedLogic?.defaultValue || 0)]}
                          min={selectedLogic?.min}
                          max={selectedLogic?.max}
                          step={selectedLogic?.step}
                          onValueChange={(values) => handleValueChange(values[0].toString())}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {condition.value || selectedLogic?.defaultValue || ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
         
            

            {/* Secondary Indicator Parameters */}
            {selectedLogic?.customInput && (
              (selectedLogic.logicParams ||
                ((condition.logic?.includes("crosses") ||
                  condition.logic?.includes("above") ||
                  condition.logic?.includes("below")) &&
                  MOVING_AVERAGE_INDICATORS.includes(condition.indicator))
              ) && (
                <div className="space-y-4 mt-4">
                  <h3 className="text-sm font-medium">Secondary Indicator Parameters</h3>
                  {/* Secondary Indicator Type Selector */}
                  <div className="space-y-2">
                    <Label>Indicator Type</Label>
                    <Select
                      value={condition.secondaryIndicator?.type || MOVING_AVERAGE_INDICATORS[0]}
                      onValueChange={handleSecondaryIndicatorTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MOVING_AVERAGE_INDICATORS.map((key) => (
                          <SelectItem key={key} value={key}>
                            {indicatorMetadata[key].name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Secondary Indicator Parameters */}
                  {condition.secondaryIndicator && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Render parameters based on the selected indicator type */}
                      {Object.entries(indicatorMetadata[condition.secondaryIndicator.type].parameters).map(([key, param]: [string, IndicatorParameter]) => (
                        <div key={key} className="space-y-2">
                          <Label>{param.name}</Label>
                          {param.type === "select" ? (
                            <Select
                              value={String(condition.secondaryIndicator?.params?.[key] ?? param.default)}
                              onValueChange={(value) => handleLogicParamChange(key, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {(param.options as Array<string | { value: string | number; label: string }>)?.map((option) => (
                                  typeof option === "string"
                                    ? <SelectItem key={option} value={option}>{option}</SelectItem>
                                    : <SelectItem key={String(option.value)} value={String(option.value)}>{option.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : param.type === "number" ? (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <Input
                                  type="number"
                                  value={condition.secondaryIndicator?.params?.[key] !== undefined ? String(condition.secondaryIndicator?.params?.[key]) : String(param.default)}
                                  onChange={(e) => handleLogicParamChange(key, Number(e.target.value))}
                                  min={param.min}
                                  max={param.max}
                                  step={param.step}
                                  className="w-full"
                                />
                                <span className="text-xs text-muted-foreground ml-2 w-12 text-right">
                                  {condition.secondaryIndicator?.params?.[key] !== undefined ? condition.secondaryIndicator?.params?.[key] : param.default}
                                </span>
                              </div>
                              {param.min !== undefined && param.max !== undefined && (
                                <Slider
                                  value={[Number(condition.secondaryIndicator?.params?.[key] !== undefined ? condition.secondaryIndicator?.params?.[key] : param.default)]}
                                  min={param.min}
                                  max={param.max}
                                  step={param.step}
                                  onValueChange={(values) => handleLogicParamChange(key, values[0])}
                                />
                              )}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndicatorLogicEngine;

// Dynamically determine which indicators are moving averages based on indicatorMetadata
const MOVING_AVERAGE_INDICATORS = Object.keys(indicatorMetadata).filter(
  key => {
    const meta = indicatorMetadata[key];
    // Heuristic: has 'Moving Average' in the name, or logicOptions with selectable moving average types
    return (
      meta.name?.toLowerCase().includes("moving average") ||
      (meta.logicOptions && meta.logicOptions.some(opt =>
        opt.logicParams && opt.logicParams.indicator && Array.isArray(opt.logicParams.indicator.options) &&
        opt.logicParams.indicator.options.some((o: any) => typeof o === "object" && o.label?.toLowerCase().includes("moving average"))
      ))
    );
  }
);