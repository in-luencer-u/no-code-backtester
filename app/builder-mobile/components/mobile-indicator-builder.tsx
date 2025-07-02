"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Settings, Zap, Target, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ConditionGroup, IndicatorCondition, PositionRule, IndicatorType, IndicatorLogic } from "@/components/strategy-builder/types"

interface MobileIndicatorBuilderProps {
  positionRule: PositionRule
  onChange: (updatedRule: PositionRule) => void
  title?: string
}

// Enhanced indicator options for mobile with all indicators from main builder
const MOBILE_INDICATORS = [
  { value: "rsi", label: "RSI", description: "Relative Strength Index", category: "Oscillators" },
  { value: "macd", label: "MACD", description: "Moving Average Convergence Divergence", category: "Trend" },
  { value: "sma", label: "SMA", description: "Simple Moving Average", category: "Moving Averages" },
  { value: "ema", label: "EMA", description: "Exponential Moving Average", category: "Moving Averages" },
  { value: "wma", label: "WMA", description: "Weighted Moving Average", category: "Moving Averages" },
  { value: "bollinger", label: "Bollinger Bands", description: "Bollinger Bands", category: "Volatility" },
  { value: "stochastic", label: "Stochastic", description: "Stochastic Oscillator", category: "Oscillators" },
  { value: "adx", label: "ADX", description: "Average Directional Index", category: "Trend" },
  { value: "atr", label: "ATR", description: "Average True Range", category: "Volatility" },
  { value: "supertrend", label: "SuperTrend", description: "SuperTrend Indicator", category: "Trend" },
  { value: "ichimoku", label: "Ichimoku", description: "Ichimoku Cloud", category: "Trend" },
  { value: "volume", label: "Volume", description: "Volume Analysis", category: "Volume" },
  { value: "momentum", label: "Momentum", description: "Momentum Indicator", category: "Oscillators" },
  { value: "williams_r", label: "Williams %R", description: "Williams %R", category: "Oscillators" },
  { value: "cci", label: "CCI", description: "Commodity Channel Index", category: "Oscillators" },
  { value: "roc", label: "ROC", description: "Rate of Change", category: "Oscillators" },
  { value: "vwap", label: "VWAP", description: "Volume Weighted Average Price", category: "Volume" },
  { value: "price", label: "Price", description: "Price Action", category: "Price" },
]

// Enhanced logic options based on indicator type
const getLogicOptions = (indicator: string): { value: IndicatorLogic; label: string }[] => {
  const baseOptions = [
    { value: "greater_than" as IndicatorLogic, label: "Greater than (>)" },
    { value: "less_than" as IndicatorLogic, label: "Less than (<)" },
    { value: "equals" as IndicatorLogic, label: "Equals (=)" },
    { value: "crosses_above" as IndicatorLogic, label: "Crosses above" },
    { value: "crosses_below" as IndicatorLogic, label: "Crosses below" },
  ]

  const trendOptions = [
    { value: "bullish" as IndicatorLogic, label: "Bullish" },
    { value: "bearish" as IndicatorLogic, label: "Bearish" },
    { value: "strong_trend" as IndicatorLogic, label: "Strong Trend" },
    { value: "weak_trend" as IndicatorLogic, label: "Weak Trend" },
  ]

  const oscillatorOptions = [
    { value: "overbought" as IndicatorLogic, label: "Overbought" },
    { value: "oversold" as IndicatorLogic, label: "Oversold" },
    { value: "enters_overbought" as IndicatorLogic, label: "Enters Overbought" },
    { value: "exits_overbought" as IndicatorLogic, label: "Exits Overbought" },
    { value: "enters_oversold" as IndicatorLogic, label: "Enters Oversold" },
    { value: "exits_oversold" as IndicatorLogic, label: "Exits Oversold" },
  ]

  const macdOptions = [
    { value: "zero_cross_up" as IndicatorLogic, label: "Zero Cross Up" },
    { value: "zero_cross_down" as IndicatorLogic, label: "Zero Cross Down" },
    { value: "histogram_positive" as IndicatorLogic, label: "Histogram Positive" },
    { value: "histogram_negative" as IndicatorLogic, label: "Histogram Negative" },
    { value: "histogram_increasing" as IndicatorLogic, label: "Histogram Increasing" },
    { value: "histogram_decreasing" as IndicatorLogic, label: "Histogram Decreasing" },
  ]

  const ichimokuOptions = [
    { value: "above_cloud" as IndicatorLogic, label: "Above Cloud" },
    { value: "below_cloud" as IndicatorLogic, label: "Below Cloud" },
    { value: "inside_cloud" as IndicatorLogic, label: "Inside Cloud" },
    { value: "tenkan_kijun_cross" as IndicatorLogic, label: "Tenkan/Kijun Cross" },
  ]

  const adxOptions = [
    { value: "di_plus_above_di_minus" as IndicatorLogic, label: "DI+ Above DI-" },
    { value: "di_plus_below_di_minus" as IndicatorLogic, label: "DI+ Below DI-" },
  ]

  const bollingerOptions = [
    { value: "inside" as IndicatorLogic, label: "Inside Bands" },
    { value: "outside" as IndicatorLogic, label: "Outside Bands" },
    { value: "touches" as IndicatorLogic, label: "Touches Band" },
  ]

  const volumeOptions = [
    { value: "above_average" as IndicatorLogic, label: "Above Average" },
    { value: "below_average" as IndicatorLogic, label: "Below Average" },
    { value: "spike" as IndicatorLogic, label: "Volume Spike" },
  ]

  // Return appropriate options based on indicator
  if (["rsi", "stochastic", "williams_r", "cci", "momentum"].includes(indicator)) {
    return [...baseOptions, ...oscillatorOptions]
  }
  if (indicator === "macd") {
    return [...baseOptions, ...macdOptions]
  }
  if (indicator === "ichimoku") {
    return [...baseOptions, ...ichimokuOptions, ...trendOptions]
  }
  if (indicator === "adx") {
    return [...baseOptions, ...adxOptions, ...trendOptions]
  }
  if (indicator === "bollinger") {
    return [...baseOptions, ...bollingerOptions]
  }
  if (["volume", "vwap"].includes(indicator)) {
    return [...baseOptions, ...volumeOptions]
  }
  if (["sma", "ema", "wma"].includes(indicator)) {
    return [...baseOptions, ...trendOptions]
  }
  
  return baseOptions
}

const TIMEFRAMES = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "30m", label: "30 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
]

// Get default parameters for indicator
const getDefaultParams = (indicator: string) => {
  const defaults: Record<string, any> = {
    period: 14,
    source: "close",
  }

  switch (indicator) {
    case "macd":
      return { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, source: "close" }
    case "bollinger":
      return { period: 20, stdDev: 2, source: "close" }
    case "stochastic":
      return { kPeriod: 14, dPeriod: 3, slowing: 3 }
    case "supertrend":
      return { period: 10, multiplier: 3 }
    case "ichimoku":
      return { conversionPeriod: 9, basePeriod: 26, laggingSpanPeriod: 52, displacement: 26 }
    case "atr":
      return { period: 14 }
    case "adx":
      return { period: 14 }
    case "volume":
      return { averageVolumeBar: 20 }
    default:
      return defaults
  }
}

export default function MobileIndicatorBuilder({ positionRule, onChange, title }: MobileIndicatorBuilderProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const addConditionGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      conditions: [
        {
          id: `condition-${Date.now()}`,
          indicator: "rsi",
          logic: "less_than",
          value: "30",
          timeframe: "1d",
          params: getDefaultParams("rsi"),
        },
      ],
      operator: "or",
    }

    onChange({
      ...positionRule,
      conditionGroups: [...positionRule.conditionGroups, newGroup],
    })

    // Auto-expand the new group
    setExpandedGroups((prev) => [...prev, newGroup.id])
  }

  const removeConditionGroup = (groupId: string) => {
    onChange({
      ...positionRule,
      conditionGroups: positionRule.conditionGroups.filter((group) => group.id !== groupId),
    })
    setExpandedGroups((prev) => prev.filter((id) => id !== groupId))
  }

  const updateConditionGroup = (groupId: string, updatedGroup: Partial<ConditionGroup>) => {
    onChange({
      ...positionRule,
      conditionGroups: positionRule.conditionGroups.map((group) =>
        group.id === groupId ? { ...group, ...updatedGroup } : group,
      ),
    })
  }

  const addCondition = (groupId: string) => {
    const newCondition: IndicatorCondition = {
      id: `condition-${Date.now()}`,
      indicator: "rsi",
      logic: "less_than",
      value: "30",
      timeframe: "1d",
      params: getDefaultParams("rsi"),
    }

    const group = positionRule.conditionGroups.find((g) => g.id === groupId)
    if (group) {
      updateConditionGroup(groupId, {
        conditions: [...group.conditions, newCondition],
      })
    }
  }

  const removeCondition = (groupId: string, conditionId: string) => {
    const group = positionRule.conditionGroups.find((g) => g.id === groupId)
    if (group) {
      updateConditionGroup(groupId, {
        conditions: group.conditions.filter((c) => c.id !== conditionId),
      })
    }
  }

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<IndicatorCondition>) => {
    const group = positionRule.conditionGroups.find((g) => g.id === groupId)
    if (group) {
      const updatedCondition = group.conditions.map((c) => {
        if (c.id === conditionId) {
          const updated = { ...c, ...updates }
          // If indicator changed, update params to defaults
          if (updates.indicator && updates.indicator !== c.indicator) {
            updated.params = getDefaultParams(updates.indicator)
          }
          return updated
        }
        return c
      })
      updateConditionGroup(groupId, { conditions: updatedCondition })
    }
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  if (positionRule.conditionGroups.length === 0) {
    return (
      <div className="text-center py-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="p-4 rounded-lg bg-background/40 border border-purple-500/20">
            <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No conditions set yet</p>
            <Button onClick={addConditionGroup} size="sm" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add First Condition
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {positionRule.conditionGroups.map((group, groupIndex) => {
        const isExpanded = expandedGroups.includes(group.id)

        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <Card className="border-purple-500/20 bg-background/40 backdrop-blur-xl">
              <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(group.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-purple-400 rounded-full" />
                        <CardTitle className="text-sm">Condition Group {groupIndex + 1}</CardTitle>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                          {group.conditions.length} rule{group.conditions.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {positionRule.conditionGroups.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeConditionGroup(group.id)
                            }}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {group.conditions.map((condition, conditionIndex) => (
                      <motion.div
                        key={condition.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: conditionIndex * 0.1 }}
                        className="p-3 rounded-lg bg-background/60 border border-purple-500/20 space-y-3"
                      >
                        {/* Condition Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="h-3 w-3 text-purple-400" />
                            <span className="text-xs font-medium text-purple-300">Rule {conditionIndex + 1}</span>
                          </div>
                          {group.conditions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCondition(group.id, condition.id)}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {/* Indicator Selection */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Indicator</Label>
                          <Select
                            value={condition.indicator}
                            onValueChange={(value) =>
                              updateCondition(group.id, condition.id, { indicator: value as IndicatorType })
                            }
                          >
                            <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20 max-h-60">
                              {MOBILE_INDICATORS.map((indicator) => (
                                <SelectItem key={indicator.value} value={indicator.value}>
                                  <div>
                                    <div className="font-medium">{indicator.label}</div>
                                    <div className="text-xs text-muted-foreground">{indicator.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Logic and Value */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Logic</Label>
                            <Select
                              value={condition.logic}
                              onValueChange={(value) =>
                                updateCondition(group.id, condition.id, { logic: value as IndicatorLogic })
                              }
                            >
                              <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20 max-h-60">
                                {getLogicOptions(condition.indicator).map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Value</Label>
                            <Input
                              type="number"
                              value={condition.value}
                              onChange={(e) => updateCondition(group.id, condition.id, { value: e.target.value })}
                              className="bg-background/80 border-purple-500/20 text-sm"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Timeframe */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Timeframe</Label>
                          <Select
                            value={condition.timeframe}
                            onValueChange={(value) => updateCondition(group.id, condition.id, { timeframe: value })}
                          >
                            <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                              {TIMEFRAMES.map((tf) => (
                                <SelectItem key={tf.value} value={tf.value}>
                                  {tf.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* OR separator between conditions */}
                        {conditionIndex < group.conditions.length - 1 && (
                          <div className="flex justify-center py-2">
                            <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                              OR
                            </Badge>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Add Condition Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addCondition(group.id)}
                      className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/10 text-sm"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add Another Condition
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* OR separator between groups */}
            {groupIndex < positionRule.conditionGroups.length - 1 && (
              <div className="flex justify-center py-2">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  OR
                </Badge>
              </div>
            )}
          </motion.div>
        )
      })}

      {/* Add Group Button */}
      <Button
        variant="outline"
        onClick={addConditionGroup}
        className="w-full border-dashed border-purple-500/30 text-purple-200 hover:bg-purple-500/10 bg-transparent"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Alternative Group
      </Button>
    </div>
  )
}
