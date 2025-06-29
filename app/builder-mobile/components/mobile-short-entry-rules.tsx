"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingDown, Plus, Trash2, Settings, Zap, Target, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { ConditionGroup, IndicatorCondition, PositionRule, IndicatorType, IndicatorLogic } from "@/components/strategy-builder/types"
import { indicatorMetadata } from "@/components/strategy-builder/indicator-metadata"

interface MobileShortEntryRulesProps {
  positionRule: PositionRule
  onChange: (updatedRule: PositionRule) => void
}

// All available indicators from metadata
const ALL_INDICATORS = Object.entries(indicatorMetadata).map(([key, metadata]) => ({
  value: key,
  label: metadata.name,
  description: metadata.description,
  category: metadata.category,
}))

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

// Get logic options for an indicator
const getLogicOptions = (indicator: string) => {
  const metadata = indicatorMetadata[indicator]
  if (!metadata) return []
  
  return metadata.logicOptions.map(option => ({
    value: option.value,
    label: option.label,
    description: option.description,
    requiresValue: option.requiresValue,
    defaultValue: option.defaultValue,
  }))
}

// Get default parameters for indicator
const getDefaultParams = (indicator: string) => {
  const metadata = indicatorMetadata[indicator]
  if (!metadata) return { period: 14, source: "close" }
  
  const params: Record<string, any> = {}
  Object.entries(metadata.parameters).forEach(([key, param]) => {
    params[key] = param.default
  })
  
  return params
}

export default function MobileShortEntryRules({ positionRule, onChange }: MobileShortEntryRulesProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(positionRule.conditionGroups.map(g => g.id))

  useEffect(() => {
    setExpandedGroups(positionRule.conditionGroups.map(g => g.id))
  }, [positionRule.conditionGroups])

  const addConditionGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      conditions: [
        {
          id: `condition-${Date.now()}`,
          indicator: "rsi",
          logic: "greater_than",
          value: "70",
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
      logic: "greater_than",
      value: "70",
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

  const updateParam = (groupId: string, conditionId: string, paramKey: string, value: any) => {
    const group = positionRule.conditionGroups.find((g) => g.id === groupId)
    if (group) {
      const updatedCondition = group.conditions.map((c) => {
        if (c.id === conditionId) {
          return {
            ...c,
            params: { ...c.params, [paramKey]: value },
          }
        }
        return c
      })
      updateConditionGroup(groupId, { conditions: updatedCondition })
    }
  }

  const updateSecondaryIndicator = (groupId: string, conditionId: string, key: string, value: any, isType = false) => {
    const group = positionRule.conditionGroups.find((g) => g.id === groupId)
    if (group) {
      const updatedCondition = group.conditions.map((c) => {
        if (c.id === conditionId) {
          if (isType) {
            // When changing type, reset params to defaults
            const meta = indicatorMetadata[value]
            return {
              ...c,
              secondaryIndicator: {
                type: value,
                params: Object.fromEntries(Object.entries(meta?.parameters || {}).map(([k, v]) => [k, v.default]))
              },
            }
          } else {
            return {
              ...c,
              secondaryIndicator: {
                ...c.secondaryIndicator,
                params: { ...c.secondaryIndicator?.params, [key]: value },
                type: c.secondaryIndicator?.type,
              },
            }
          }
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
          <div className="p-4 rounded-lg bg-background/40 border border-red-500/20">
            <TrendingDown className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No short entry conditions set yet</p>
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
      {/* Header */}
      <Card className="border-red-500/20 bg-background/60 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-medium text-red-300">Short Entry Rules</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Define when to enter short positions (sell). These conditions will trigger when all are met.
          </p>
        </CardContent>
      </Card>

      {positionRule.conditionGroups.map((group, groupIndex) => {
        const isExpanded = expandedGroups.includes(group.id)
        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <Card className="border-red-500/20 bg-background/40 backdrop-blur-xl">
              <Collapsible open={isExpanded} onOpenChange={() => toggleGroup(group.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-red-400 rounded-full" />
                        <CardTitle className="text-sm">Condition Group {groupIndex + 1}</CardTitle>
                        <Badge variant="outline" className="border-red-500/30 text-red-300 text-xs">
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
                    {group.conditions.map((condition, conditionIndex) => {
                      const indicatorMeta = indicatorMetadata[condition.indicator]
                      if (!indicatorMeta) return null
                      const logicOptions = indicatorMeta.logicOptions.filter(opt => !String(opt.label).startsWith("//"))
                      const selectedLogic = logicOptions.find(opt => opt.value === condition.logic)
                      const paramKeys = Object.keys(indicatorMeta.parameters)
                      const showSecondary = selectedLogic && selectedLogic.customInput && selectedLogic.logicParams
                      return (
                        <motion.div
                          key={condition.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: conditionIndex * 0.1 }}
                          className="p-3 rounded-lg bg-background/60 border border-red-500/20 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-3 w-3 text-red-400" />
                              <span className="text-xs font-medium text-red-300">Rule {conditionIndex + 1}</span>
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
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Indicator</Label>
                            <Select
                              value={condition.indicator}
                              onValueChange={(value) =>
                                updateCondition(group.id, condition.id, { indicator: value as IndicatorType })
                              }
                            >
                              <SelectTrigger className="bg-background/80 border-red-500/20 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-xl border-red-500/20 max-h-60">
                                {ALL_INDICATORS.filter(i => !String(i.label).startsWith("//")).map((indicator) => (
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
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Logic</Label>
                            <Select
                              value={condition.logic}
                              onValueChange={(value) =>
                                updateCondition(group.id, condition.id, { logic: value as IndicatorLogic })
                              }
                            >
                              <SelectTrigger className="bg-background/80 border-red-500/20 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-xl border-red-500/20 max-h-60">
                                {logicOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {paramKeys.map((paramKey) => {
                            const param = indicatorMeta.parameters[paramKey]
                            if (!param || String(param.name).startsWith("//")) return null
                            return (
                              <div className="space-y-2" key={paramKey}>
                                <Label className="text-xs font-medium">{param.name}</Label>
                                {param.type === "number" ? (
                                  <Input
                                    type="number"
                                    value={condition.params?.[paramKey] ?? param.default}
                                    onChange={e => updateParam(group.id, condition.id, paramKey, e.target.value)}
                                    className="bg-background/80 border-red-500/20 text-sm"
                                  />
                                ) : param.type === "select" ? (
                                  <Select
                                    value={String(condition.params?.[paramKey] ?? param.default)}
                                    onValueChange={value => updateParam(group.id, condition.id, paramKey, value)}
                                  >
                                    <SelectTrigger className="bg-background/80 border-red-500/20 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background/95 backdrop-blur-xl border-red-500/20 max-h-60">
                                      {(param.options as any[]).filter(opt => !String(opt.label || opt).startsWith("//")).map(opt => (
                                        <SelectItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                                          {typeof opt === 'string' ? opt : opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : null}
                              </div>
                            )
                          })}
                          {showSecondary && (
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">Secondary Indicator</Label>
                              <Select
                                value={condition.secondaryIndicator?.type || ""}
                                onValueChange={value => updateSecondaryIndicator(group.id, condition.id, "type", value, true)}
                              >
                                <SelectTrigger className="bg-background/80 border-red-500/20 text-sm">
                                  <SelectValue placeholder="Select indicator" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-xl border-red-500/20 max-h-60">
                                  {ALL_INDICATORS.filter(i => !String(i.label).startsWith("//")).map((indicator) => (
                                    <SelectItem key={indicator.value} value={indicator.value}>
                                      <div>
                                        <div className="font-medium">{indicator.label}</div>
                                        <div className="text-xs text-muted-foreground">{indicator.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {/* Render params for selected secondary indicator */}
                              {condition.secondaryIndicator?.type && (
                                Object.entries(indicatorMetadata[condition.secondaryIndicator.type]?.parameters || {}).map(([paramKey, param]) => (
                                  <div className="space-y-2" key={paramKey}>
                                    <Label className="text-xs font-medium">{param.name}</Label>
                                    {param.type === "number" ? (
                                      <Input
                                        type="number"
                                        value={condition.secondaryIndicator?.params?.[paramKey] ?? param.default}
                                        onChange={e => updateSecondaryIndicator(group.id, condition.id, paramKey, e.target.value)}
                                        className="bg-background/80 border-red-500/20 text-sm"
                                      />
                                    ) : param.type === "select" ? (
                                      <Select
                                        value={String(condition.secondaryIndicator?.params?.[paramKey] ?? param.default)}
                                        onValueChange={value => updateSecondaryIndicator(group.id, condition.id, paramKey, value)}
                                      >
                                        <SelectTrigger className="bg-background/80 border-red-500/20 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background/95 backdrop-blur-xl border-red-500/20 max-h-60">
                                          {(param.options as any[]).filter(opt => !String(opt.label || opt).startsWith("//")).map(opt => (
                                            <SelectItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                                              {typeof opt === 'string' ? opt : opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : null}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          {selectedLogic?.requiresValue !== false && (
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">Value</Label>
                              <Input
                                type="number"
                                value={condition.value}
                                onChange={e => updateCondition(group.id, condition.id, { value: e.target.value })}
                                className="bg-background/80 border-red-500/20 text-sm"
                                placeholder="0"
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Timeframe</Label>
                            <Select
                              value={condition.timeframe}
                              onValueChange={(value) => updateCondition(group.id, condition.id, { timeframe: value })}
                            >
                              <SelectTrigger className="bg-background/80 border-red-500/20 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-xl border-red-500/20">
                                {TIMEFRAMES.map((tf) => (
                                  <SelectItem key={tf.value} value={tf.value}>
                                    {tf.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {conditionIndex < group.conditions.length - 1 && (
                            <div className="flex justify-center py-2">
                              <Badge variant="outline" className="border-red-500/30 text-red-300 text-xs">
                                OR
                              </Badge>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addCondition(group.id)}
                      className="w-full border-red-500/30 text-red-200 hover:bg-red-500/10 text-sm"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add Another Condition
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            {groupIndex < positionRule.conditionGroups.length - 1 && (
              <div className="flex justify-center py-2">
                <Badge variant="outline" className="border-red-500/30 text-red-300">
                  OR
                </Badge>
              </div>
            )}
          </motion.div>
        )
      })}
      <Button
        variant="outline"
        onClick={addConditionGroup}
        className="w-full border-dashed border-red-500/30 text-red-200 hover:bg-red-500/10 bg-transparent"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Alternative Group
      </Button>
    </div>
  )
} 