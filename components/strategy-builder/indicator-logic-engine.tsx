"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Info, HelpCircle, Trash2, TrendingUp, Settings, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { IndicatorType, IndicatorLogic, IndicatorParams, IndicatorCondition } from "./types"
import type { IndicatorParameter, IndicatorMetadata, LogicOption } from "./indicator-metadata"
import { indicatorMetadata } from "./indicator-metadata"

// Extend IndicatorCondition for UI only (not in shared types)
type IndicatorConditionWithSecondary = IndicatorCondition & {
  secondaryIndicator?: {
    type: IndicatorType
    params: IndicatorParams
  }
}

interface IndicatorLogicEngineProps {
  condition: IndicatorConditionWithSecondary
  onChange: (updatedCondition: IndicatorConditionWithSecondary) => void
  onRemove?: () => void
}

// Utility: Type guard for IndicatorType
function isIndicatorType(value: string): value is IndicatorType {
  return Object.keys(indicatorMetadata).includes(value)
}

// Utility: Get default indicator params for a type
const defaultIndicatorParams: IndicatorParams = { period: 14, source: "close" }

const defaultIndicatorMetadata: any = {
  defaultParams: { period: 14, source: "close" },
  defaultLogic: "less_than",
  logicOptions: [{ value: "less_than", label: "Less Than" }],
}

// Add type guard for option type
function isOptionObject(option: string | { value: string; label: string }): option is { value: string; label: string } {
  return typeof option === "object" && option !== null && "value" in option && "label" in option
}

// Add type for select options
type SelectOption = string | { value: string; label: string }

const IndicatorLogicEngine: React.FC<IndicatorLogicEngineProps> = ({ condition, onChange, onRemove }) => {
  // Cast condition to extended type for UI logic
  const cond = condition as IndicatorConditionWithSecondary

  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const indicator = indicatorMetadata[condition.indicator] as IndicatorMetadata
  const selectedLogic = indicator?.logicOptions.find((option) => option.value === condition.logic) as
    | LogicOption
    | undefined

  // Initialize parameters with proper typing
  useEffect(() => {
    if (indicator && !isInitialized) {
      const initialValues: Record<string, string | number | boolean> = {}
      Object.entries(indicator.parameters).forEach(([key, param]: [string, IndicatorParameter]) => {
        initialValues[key] = condition.params?.[key] ?? param.default
      })

      onChange({
        ...condition,
        value: condition.value || selectedLogic?.defaultValue?.toString() || "0",
        params: {
          ...condition.params,
          ...initialValues,
        },
      })

      setIsInitialized(true)
    }
  }, [indicator, isInitialized, condition, onChange, selectedLogic?.defaultValue])

  // Reset initialization when indicator changes
  useEffect(() => {
    setIsInitialized(false)
  }, [condition.indicator])

  // Handle indicator change with type safety
  const handleIndicatorChange = (value: string) => {
    if (!isIndicatorType(value)) return

    const indicatorType = value
    const newIndicator = indicatorMetadata[indicatorType] || defaultIndicatorMetadata
    onChange({
      ...condition,
      indicator: indicatorType,
      logic: (newIndicator.defaultLogic || newIndicator.logicOptions[0].value) as IndicatorLogic,
      params: { ...defaultIndicatorParams },
    })
  }

  // Type-safe logic change handler
  const handleLogicChange = (value: IndicatorLogic) => {
    if (!indicator.logicOptions.some((option) => option.value === value)) return

    // Create updated condition with new logic
    const updatedCondition = {
      ...condition,
      logic: value,
    }

    // Only initialize secondary indicator for moving averages (from metadata)
    const selectedLogicOption = indicator.logicOptions.find((opt) => opt.value === value)
    if (
      (value.includes("crosses") || value.includes("above") || value.includes("below")) &&
      !updatedCondition.secondaryIndicator &&
      selectedLogicOption?.customInput &&
      MOVING_AVERAGE_INDICATORS.includes(condition.indicator)
    ) {
      // Get first available moving average indicator from metadata
      const firstMA = MOVING_AVERAGE_INDICATORS[0]
      updatedCondition.secondaryIndicator = {
        type: firstMA as IndicatorType,
        params: {
          ...Object.entries(indicatorMetadata[firstMA].parameters).reduce<Record<string, any>>(
            (acc, [key, param]) => ({
              ...acc,
              [key]: param.default,
            }),
            {},
          ),
        },
      }
    }

    onChange(updatedCondition)
  }

  // Handle value changes safely
  const handleValueChange = (value: string) => {
    const numericValue = Number(value)
    if (!isNaN(numericValue)) {
      onChange({
        ...condition,
        value: numericValue.toString(),
      })
    }
  }

  // Properly typed parameter change handler
  const handleParamChange = (paramName: string, value: string | number | boolean) => {
    const updatedParams = {
      ...condition.params,
      [paramName]: value,
    }
    onChange({
      ...condition,
      params: updatedParams,
    })
  }

  // Secondary indicator handling with type safety
  const handleSecondaryIndicatorTypeChange = (value: string) => {
    if (!isIndicatorType(value)) return

    // Get metadata for the selected indicator type
    const metadata = indicatorMetadata[value]

    // Initialize all parameters with their default values
    const defaults = Object.entries(metadata.parameters).reduce<Record<string, any>>((acc, [key, param]) => {
      acc[key] = param.default
      return acc
    }, {})

    onChange({
      ...condition,
      secondaryIndicator: {
        type: value as IndicatorType,
        params: defaults, // Use fresh defaults, don't merge with old params as they might not be compatible
      },
    })
  }

  const handleLogicParamChange = (paramName: string, value: string | number | boolean) => {
    if (!condition.secondaryIndicator) return

    onChange({
      ...condition,
      secondaryIndicator: {
        type: condition.secondaryIndicator.type,
        params: {
          ...condition.secondaryIndicator.params,
          [paramName]: value,
        },
      },
    })
  }

  if (!indicator) return null

  // Separate standard and advanced parameters
  const standardParams = Object.entries(indicator.parameters).filter(([_, param]) => !param.advanced)
  const advancedParams = Object.entries(indicator.parameters).filter(([_, param]) => param.advanced)

  return (
    <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg font-semibold">Indicator Configuration</CardTitle>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-purple-400 transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{indicator.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 self-start sm:self-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Indicator Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-purple-400" />
            <Label className="text-sm font-medium">Select Indicator</Label>
          </div>
          <Select value={condition.indicator} onValueChange={handleIndicatorChange}>
            <SelectTrigger className="w-full bg-background/80 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20 max-h-60">
              {Object.entries(indicatorMetadata)
                .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                .map(([key, meta]) => (
                  <SelectItem key={key} value={key} className="hover:bg-purple-500/10">
                    {meta.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Standard Parameters */}
        {standardParams.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-medium">Parameters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {standardParams.map(
                ([key, param]: [string, IndicatorParameter]) =>
                  (typeof param.showIf !== "function" || param.showIf(condition.params ?? {})) && (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {param.name}
                        </Label>
                        {param.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help hover:text-purple-400 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
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
                          <SelectTrigger className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                            {(param.options as Array<string | { value: string | number; label: string }>)?.map(
                              (option) =>
                                typeof option === "string" ? (
                                  <SelectItem key={option} value={option} className="hover:bg-purple-500/10">
                                    {option}
                                  </SelectItem>
                                ) : (
                                  <SelectItem
                                    key={String(option.value)}
                                    value={String(option.value)}
                                    className="hover:bg-purple-500/10"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ),
                            )}
                          </SelectContent>
                        </Select>
                      ) : param.type === "number" ? (
                        <Input
                          type="number"
                          id={key}
                          value={String(condition.params?.[key] || param.default)}
                          onChange={(e) => handleParamChange(key, Number(e.target.value))}
                          className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors"
                        />
                      ) : param.type === "boolean" ? (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/40 border border-purple-500/20">
                          <Switch
                            id={key}
                            checked={Boolean(condition.params?.[key] ?? param.default)}
                            onCheckedChange={(checked) => handleParamChange(key, checked)}
                          />
                          <Label htmlFor={key} className="text-sm text-muted-foreground">
                            {Boolean(condition.params?.[key] ?? param.default) ? "Enabled" : "Disabled"}
                          </Label>
                        </div>
                      ) : (
                        <Input
                          type="text"
                          id={key}
                          value={String(condition.params?.[key] || param.default)}
                          onChange={(e) => handleParamChange(key, e.target.value)}
                          className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors"
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
            <AccordionItem value="advanced-params" className="border-purple-500/20">
              <AccordionTrigger className="text-sm font-medium hover:text-purple-400 transition-colors">
                Advanced Parameters
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {advancedParams.map(([key, param]: [string, IndicatorParameter]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">{param.name}</Label>
                        {param.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help hover:text-purple-400 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
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
                          <SelectTrigger className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                            {(param.options as Array<string | { value: string | number; label: string }>)?.map(
                              (option) =>
                                typeof option === "string" ? (
                                  <SelectItem key={option} value={option} className="hover:bg-purple-500/10">
                                    {option}
                                  </SelectItem>
                                ) : (
                                  <SelectItem
                                    key={String(option.value)}
                                    value={String(option.value)}
                                    className="hover:bg-purple-500/10"
                                  >
                                    {option.label}
                                  </SelectItem>
                                ),
                            )}
                          </SelectContent>
                        </Select>
                      ) : param.type === "number" ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              value={String(condition.params?.[key] || param.default)}
                              onChange={(e) => handleParamChange(key, Number.parseFloat(e.target.value))}
                              min={param.min}
                              max={param.max}
                              step={param.step}
                              className="flex-1 bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors"
                            />
                            <Badge
                              variant="outline"
                              className="px-2 py-1 text-xs font-mono border-purple-500/30 text-purple-300"
                            >
                              {condition.params?.[key] || param.default}
                            </Badge>
                          </div>
                          {param.min !== undefined && param.max !== undefined && (
                            <Slider
                              value={[Number(condition.params?.[key] || param.default)]}
                              min={param.min}
                              max={param.max}
                              step={param.step}
                              onValueChange={(values) => handleParamChange(key, values[0])}
                              className="w-full"
                            />
                          )}
                        </div>
                      ) : param.type === "boolean" ? (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/40 border border-purple-500/20">
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
                          className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors"
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
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-medium">Logic Configuration</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logic Dropdown */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Logic Type</Label>
              <Select value={condition.logic} onValueChange={handleLogicChange}>
                <SelectTrigger className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                  {indicator.logicOptions.map((option: LogicOption) => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-purple-500/10">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLogic?.description && (
                <p className="text-xs text-muted-foreground bg-background/40 p-2 rounded border border-purple-500/20">
                  {selectedLogic.description}
                </p>
              )}
            </div>

            {/* Custom Logic Input */}
            {((selectedLogic?.customInput && !MOVING_AVERAGE_INDICATORS.includes(condition.indicator)) ||
              (!MOVING_AVERAGE_INDICATORS.includes(condition.indicator) &&
                (condition.logic === "crosses_above" || condition.logic === "crosses_below"))) && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">{selectedLogic?.inputLabel || "Custom Value"}</Label>
                <div className="space-y-3">
                  <Input
                    type={selectedLogic?.valueType === "number" ? "number" : "text"}
                    value={condition.value || selectedLogic?.defaultValue?.toString() || ""}
                    onChange={(e) => handleValueChange(e.target.value)}
                    min={selectedLogic?.min}
                    max={selectedLogic?.max}
                    step={selectedLogic?.step}
                    className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors"
                  />
                  {selectedLogic?.valueType === "number" &&
                    selectedLogic?.min !== undefined &&
                    selectedLogic?.max !== undefined && (
                      <div className="flex items-center gap-3">
                        <Slider
                          value={[Number(condition.value || selectedLogic?.defaultValue || 0)]}
                          min={selectedLogic?.min}
                          max={selectedLogic?.max}
                          step={selectedLogic?.step}
                          onValueChange={(values) => handleValueChange(values[0].toString())}
                          className="flex-1"
                        />
                        <Badge
                          variant="outline"
                          className="px-2 py-1 text-xs font-mono border-purple-500/30 text-purple-300"
                        >
                          {condition.value || selectedLogic?.defaultValue || ""}
                        </Badge>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Indicator Parameters */}
          {selectedLogic?.customInput &&
            (selectedLogic.logicParams ||
              ((condition.logic?.includes("crosses") ||
                condition.logic?.includes("above") ||
                condition.logic?.includes("below")) &&
                MOVING_AVERAGE_INDICATORS.includes(condition.indicator))) && (
              <div className="space-y-4 p-4 rounded-lg bg-background/40 border border-purple-500/20">
                <h3 className="text-sm font-medium text-purple-300">Secondary Indicator Parameters</h3>

                {/* Secondary Indicator Type Selector */}
                <div className="space-y-2">
                  <Label className="text-sm">Indicator Type</Label>
                  <Select
                    value={condition.secondaryIndicator?.type || MOVING_AVERAGE_INDICATORS[0]}
                    onValueChange={handleSecondaryIndicatorTypeChange}
                  >
                    <SelectTrigger className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                      {MOVING_AVERAGE_INDICATORS.map((key) => (
                        <SelectItem key={key} value={key} className="hover:bg-purple-500/10">
                          {indicatorMetadata[key].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Indicator Parameters */}
                {condition.secondaryIndicator && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(indicatorMetadata[condition.secondaryIndicator.type].parameters).map(
                      ([key, param]: [string, IndicatorParameter]) => (
                        <div key={key} className="space-y-2">
                          <Label className="text-sm">{param.name}</Label>
                          {param.type === "select" ? (
                            <Select
                              value={String(condition.secondaryIndicator?.params?.[key] ?? param.default)}
                              onValueChange={(value) => handleLogicParamChange(key, value)}
                            >
                              <SelectTrigger className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                                {(param.options as Array<string | { value: string | number; label: string }>)?.map(
                                  (option) =>
                                    typeof option === "string" ? (
                                      <SelectItem key={option} value={option} className="hover:bg-purple-500/10">
                                        {option}
                                      </SelectItem>
                                    ) : (
                                      <SelectItem
                                        key={String(option.value)}
                                        value={String(option.value)}
                                        className="hover:bg-purple-500/10"
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ),
                                )}
                              </SelectContent>
                            </Select>
                          ) : param.type === "number" ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Input
                                  type="number"
                                  value={
                                    condition.secondaryIndicator?.params?.[key] !== undefined
                                      ? String(condition.secondaryIndicator?.params?.[key])
                                      : String(param.default)
                                  }
                                  onChange={(e) => handleLogicParamChange(key, Number(e.target.value))}
                                  min={param.min}
                                  max={param.max}
                                  step={param.step}
                                  className="flex-1 bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors"
                                />
                                <Badge
                                  variant="outline"
                                  className="px-2 py-1 text-xs font-mono border-purple-500/30 text-purple-300"
                                >
                                  {condition.secondaryIndicator?.params?.[key] !== undefined
                                    ? condition.secondaryIndicator?.params?.[key]
                                    : param.default}
                                </Badge>
                              </div>
                              {param.min !== undefined && param.max !== undefined && (
                                <Slider
                                  value={[
                                    Number(
                                      condition.secondaryIndicator?.params?.[key] !== undefined
                                        ? condition.secondaryIndicator?.params?.[key]
                                        : param.default,
                                    ),
                                  ]}
                                  min={param.min}
                                  max={param.max}
                                  step={param.step}
                                  onValueChange={(values) => handleLogicParamChange(key, values[0])}
                                  className="w-full"
                                />
                              )}
                            </div>
                          ) : null}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}

export default IndicatorLogicEngine

// Dynamically determine which indicators are moving averages based on indicatorMetadata
const MOVING_AVERAGE_INDICATORS = Object.keys(indicatorMetadata).filter((key) => {
  const meta = indicatorMetadata[key]
  // Heuristic: has 'Moving Average' in the name, or logicOptions with selectable moving average types
  return (
    meta.name?.toLowerCase().includes("moving average") ||
    (meta.logicOptions &&
      meta.logicOptions.some(
        (opt) =>
          opt.logicParams &&
          opt.logicParams.indicator &&
          Array.isArray(opt.logicParams.indicator.options) &&
          opt.logicParams.indicator.options.some(
            (o: any) => typeof o === "object" && o.label?.toLowerCase().includes("moving average"),
          ),
      ))
  )
})
