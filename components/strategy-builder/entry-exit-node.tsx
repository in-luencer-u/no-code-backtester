"use client"

import { Plus, Trash2, Info, Settings } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Badge } from "../ui/badge"
import type { ConditionGroup, IndicatorCondition, PositionRule } from "./types"
import IndicatorLogicEngine from "./indicator-logic-engine"

interface EntryExitNodeProps {
  positionRule: PositionRule
  onChange: (updatedRule: PositionRule) => void
  title?: string
}

const EntryExitNode = ({ positionRule, onChange, title = "Entry/Exit Rules" }: EntryExitNodeProps) => {
  const groups = positionRule.conditionGroups

  const addConditionGroup = () => {
    const newGroup: ConditionGroup = {
      id: "group-" + Date.now(),
      conditions: [
        {
          id: "condition-" + Date.now(),
          indicator: "rsi",
          logic: "less_than",
          value: "30",
          timeframe: "1d",
          params: {
            period: 14,
            source: "close",
          },
        },
      ],
      operator: "or",
    }

    onChange({
      ...positionRule,
      conditionGroups: [...groups, newGroup],
    })
  }

  const removeConditionGroup = (groupId: string) => {
    onChange({
      ...positionRule,
      conditionGroups: groups.filter((group) => group.id !== groupId),
    })
  }

  const updateConditionGroup = (groupId: string, updatedGroup: Partial<ConditionGroup>) => {
    onChange({
      ...positionRule,
      conditionGroups: groups.map((group) => (group.id === groupId ? { ...group, ...updatedGroup } : group)),
    })
  }

  return (
    <div className="space-y-6">
      {positionRule.conditionGroups.map((group, groupIndex) => (
        <div key={group.id} className="space-y-4">
          <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      {title} Group {groupIndex + 1}
                    </CardTitle>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-purple-400 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>
                          Configure your trading conditions for {title.toLowerCase()}. Each group represents an
                          alternative set of conditions.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {groups.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConditionGroup(group.id)}
                    className="h-8 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 self-start sm:self-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-6">
                {group.conditions.map((condition, conditionIndex) => (
                  <div key={condition.id} className="space-y-4">
                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 to-purple-600/30 rounded-full"></div>
                      <IndicatorLogicEngine
                        condition={condition}
                        onChange={(updatedCondition) => {
                          const updatedConditions = [...group.conditions]
                          updatedConditions[conditionIndex] = updatedCondition
                          updateConditionGroup(group.id, { conditions: updatedConditions })
                        }}
                        onRemove={() => {
                          const updatedConditions = group.conditions.filter((_, i) => i !== conditionIndex)
                          updateConditionGroup(group.id, { conditions: updatedConditions })
                        }}
                      />
                    </div>

                    {conditionIndex < group.conditions.length - 1 && (
                      <div className="flex justify-center py-2">
                        <Badge
                          variant="outline"
                          className="px-4 py-2 font-medium text-sm bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors"
                        >
                          OR
                        </Badge>
                      </div>
                    )}

                    {conditionIndex === group.conditions.length - 1 && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/50">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4 text-purple-400" />
                            <h4 className="font-medium text-sm text-foreground">Timeframe</h4>
                          </div>
                          <Select
                            value={condition.timeframe}
                            onValueChange={(value: string) => {
                              const updatedCondition = { ...condition, timeframe: value }
                              const updatedConditions = [...group.conditions]
                              updatedConditions[conditionIndex] = updatedCondition
                              updateConditionGroup(group.id, { conditions: updatedConditions })
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-40 bg-background/80 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                              <SelectItem value="1m">1 Minute</SelectItem>
                              <SelectItem value="5m">5 Minutes</SelectItem>
                              <SelectItem value="15m">15 Minutes</SelectItem>
                              <SelectItem value="30m">30 Minutes</SelectItem>
                              <SelectItem value="45m">45 Minutes</SelectItem>
                              <SelectItem value="1h">1 Hour</SelectItem>
                              <SelectItem value="2h">2 Hours</SelectItem>
                              <SelectItem value="4h">4 Hours</SelectItem>
                              <SelectItem value="1d">1 Day</SelectItem>
                              <SelectItem value="1w">1 Week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newCondition: IndicatorCondition = {
                              id: "condition-" + Date.now(),
                              indicator: "rsi",
                              logic: "less_than",
                              value: "30",
                              timeframe: "1d",
                              params: {
                                period: 14,
                                source: "close",
                              },
                            }
                            const updatedConditions = [...group.conditions, newCondition]
                            updateConditionGroup(group.id, { conditions: updatedConditions })
                          }}
                          className="w-full sm:w-auto border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Add Condition</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {groupIndex < groups.length - 1 && (
            <div className="flex justify-center py-3">
              <Badge
                variant="outline"
                className="px-6 py-3 font-medium text-base bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-colors"
              >
                OR
              </Badge>
            </div>
          )}
        </div>
      ))}

      <Card className="border-dashed border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 bg-purple-500/5 hover:bg-purple-500/10">
        <CardContent className="pt-6">
          <Button
            variant="outline"
            onClick={addConditionGroup}
            className="w-full h-12 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 transition-all duration-200 text-base font-medium"
          >
            <Plus className="h-5 w-5 mr-3" />
            Add Alternative Condition Group
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default EntryExitNode
