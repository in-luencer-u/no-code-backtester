"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Settings, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { ConditionGroup, IndicatorCondition, PositionRule } from "../../strategy-builder/types"

interface MobileIndicatorBuilderProps {
  positionRule: PositionRule
  onChange: (updatedRule: PositionRule) => void
  title?: string
}

// Simplified indicator options for mobile
const MOBILE_INDICATORS = [
  { value: "rsi", label: "RSI", description: "Relative Strength Index" },
  { value: "sma", label: "SMA", description: "Simple Moving Average" },
  { value: "ema", label: "EMA", description: "Exponential Moving Average" },
  { value: "macd", label: "MACD", description: "Moving Average Convergence Divergence" },
  { value: "bb", label: "Bollinger Bands", description: "Bollinger Bands" },
  { value: "stoch", label: "Stochastic", description: "Stochastic Oscillator" },
]

const LOGIC_OPTIONS = [
  { value: "greater_than", label: "Greater than (>)" },
  { value: "less_than", label: "Less than (<)" },
  { value: "equals", label: "Equals (=)" },
  { value: "crosses_above", label: "Crosses above" },
  { value: "crosses_below", label: "Crosses below" },
]

const TIMEFRAMES = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
]

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
          params: { period: 14, source: "close" },
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
      params: { period: 14, source: "close" },
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
      updateConditionGroup(groupId, {
        conditions: group.conditions.map((c) => (c.id === conditionId ? { ...c, ...updates } : c)),
      })
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
                              updateCondition(group.id, condition.id, { indicator: value as any })
                            }
                          >
                            <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
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
                                updateCondition(group.id, condition.id, { logic: value as any })
                              }
                            >
                              <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                                {LOGIC_OPTIONS.map((option) => (
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
