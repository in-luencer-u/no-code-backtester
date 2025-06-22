"use client"

import { useState, useEffect } from "react"
import { Save, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

import EntryExitNode from "./entry-exit-node"
import RiskManagement from "./risk-management/risk-management-main"
import { useStrategy } from "@/context/strategy-context"
import StrategyJsonExporter from "./strategy-json-exporter"

import type {
  IndicatorCondition,
  ConditionGroup,
  PositionRule,
  IndicatorType,
  IndicatorLogic,
  RiskManagementConfig,
} from "./types"

export type StrategyConfig = {
  id: string
  name: string
  description: string
  entryLong: PositionRule
  entryShort: PositionRule
  exitLong: PositionRule
  exitShort: PositionRule
  riskManagement: RiskManagementConfig
  isPublic?: boolean
}

const generateId = (prefix: string) => `${prefix}-${new Date().toISOString()}`

const defaultCondition: IndicatorCondition = {
  id: generateId("condition"),
  indicator: "rsi" as IndicatorType,
  logic: "less_than" as IndicatorLogic,
  value: "30",
  timeframe: "1d",
  params: {
    period: 14,
    source: "close",
  },
  secondaryIndicator: {
    type: "sma" as IndicatorType,
    params: {
      period: 14,
      source: "close",
    },
  },
}

const defaultConditionGroup: ConditionGroup = {
  id: generateId("group"),
  conditions: [{ ...defaultCondition, id: generateId("condition") }],
  operator: "or",
}

const defaultPositionRule = (id: string = generateId("rule")): PositionRule => ({
  id,
  conditionGroups: [
    {
      id: generateId("group"),
      conditions: [
        {
          id: generateId("condition"),
          indicator: "rsi" as IndicatorType,
          logic: "less_than" as IndicatorLogic,
          value: "30",
          timeframe: "1d",
          params: {
            period: 14,
            source: "close",
          },
        },
      ],
      operator: "or",
    },
  ],
})

const defaultRiskManagement: RiskManagementConfig = {
  stopLoss: [
    {
      id: "sl-default",
      type: "percentage",
      value: 2,
      enabled: true,
    },
  ],
  takeProfit: [
    {
      id: "tp-default",
      type: "percentage",
      value: 5,
      enabled: true,
    },
  ],
  trailingStop: [],
  positionSizing: [
    {
      id: "ps-default",
      type: "percentage",
      value: 2,
      equityPercentage: 2,
      enabled: true,
    },
  ],
  timeExit: [],
  maxOpenPositions: 3,
  maxDrawdown: 15,
  maxDailyLoss: 5,
  maxConsecutiveLosses: 3,
  profitTarget: 20,
  riskRewardMinimum: 1.5,
  pyramiding: 0,
  experienceLevel: "beginner",
}

const defaultStrategy: StrategyConfig = {
  id: generateId("strategy"),
  name: "My Trading Strategy",
  description: "A comprehensive trading strategy with independent indicator values",
  entryLong: defaultPositionRule("entry-long"),
  entryShort: defaultPositionRule("entry-short"),
  exitLong: defaultPositionRule("exit-long"),
  exitShort: defaultPositionRule("exit-short"),
  riskManagement: defaultRiskManagement,
  isPublic: false,
}

const apiClient = {
  saveStrategy: async (strategy: StrategyConfig) => {
    try {
      const response = await fetch("/api/strategies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(strategy),
      })

      if (!response.ok) {
        throw new Error("Failed to save strategy")
      }

      return await response.json()
    } catch (error) {
      console.error("Error saving strategy:", error)
      throw error
    }
  },

  getStrategy: async (id: string) => {
    try {
      const response = await fetch(`/api/strategies/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch strategy")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching strategy:", error)
      throw error
    }
  },

  backtest: async (strategyId: string, params: any) => {
    try {
      const response = await fetch(`/api/backtest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ strategyId, ...params }),
      })

      if (!response.ok) {
        throw new Error("Failed to run backtest")
      }

      return await response.json()
    } catch (error) {
      console.error("Error running backtest:", error)
      throw error
    }
  },
}

export default function StrategyBuilder() {
  const [activeTab, setActiveTab] = useState("builder")
  const [strategy, setStrategy] = useState<StrategyConfig>({
    id: generateId("strategy"),
    name: "",
    description: "",
    entryLong: defaultPositionRule("entry-long"),
    entryShort: defaultPositionRule("entry-short"),
    exitLong: defaultPositionRule("exit-long"),
    exitShort: defaultPositionRule("exit-short"),
    riskManagement: defaultRiskManagement,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { setStrategyName, setStrategyId, setIsPublic, setIndicators } = useStrategy()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const updateStrategy = (updates: Partial<StrategyConfig>) => {
    setStrategy((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const createPositionRule = (groups: ConditionGroup[]): PositionRule => ({
    id: generateId("rule"),
    conditionGroups: groups,
  })

  const handleEntryLongUpdate = (groups: ConditionGroup[]) => updateStrategy({ entryLong: createPositionRule(groups) })
  const handleEntryShortUpdate = (groups: ConditionGroup[]) =>
    updateStrategy({ entryShort: createPositionRule(groups) })
  const handleExitLongUpdate = (groups: ConditionGroup[]) => updateStrategy({ exitLong: createPositionRule(groups) })
  const handleExitShortUpdate = (groups: ConditionGroup[]) => updateStrategy({ exitShort: createPositionRule(groups) })

  const saveStrategy = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(false)

      const strategyWithId = {
        ...strategy,
        id: strategy.id || generateId("strategy"),
        entryLong: {
          ...strategy.entryLong,
          conditionGroups: strategy.entryLong.conditionGroups.map((group) => ({
            ...group,
            conditions: group.conditions.map((condition) => ({
              ...condition,
              params: condition.params || {},
            })),
          })),
        },
        entryShort: {
          ...strategy.entryShort,
          conditionGroups: strategy.entryShort.conditionGroups.map((group) => ({
            ...group,
            conditions: group.conditions.map((condition) => ({
              ...condition,
              params: condition.params || {},
            })),
          })),
        },
        exitLong: {
          ...strategy.exitLong,
          conditionGroups: strategy.exitLong.conditionGroups.map((group) => ({
            ...group,
            conditions: group.conditions.map((condition) => ({
              ...condition,
              params: condition.params || {},
            })),
          })),
        },
        exitShort: {
          ...strategy.exitShort,
          conditionGroups: strategy.exitShort.conditionGroups.map((group) => ({
            ...group,
            conditions: group.conditions.map((condition) => ({
              ...condition,
              params: condition.params || {},
            })),
          })),
        },
      }

      setStrategyName(strategyWithId.name)
      setStrategyId(strategyWithId.id)
      setIsPublic(strategyWithId.isPublic || false)

      const indicators = new Set<string>()

      const collectIndicators = (positionRule: PositionRule) => {
        positionRule.conditionGroups.forEach((group) => {
          group.conditions.forEach((condition) => {
            indicators.add(condition.indicator)
            if (condition.params?.secondary_indicator) {
              indicators.add(condition.params.secondary_indicator)
            }
          })
        })
      }

      collectIndicators(strategyWithId.entryLong)
      collectIndicators(strategyWithId.entryShort)
      collectIndicators(strategyWithId.exitLong)
      collectIndicators(strategyWithId.exitShort)

      setIndicators(Array.from(indicators))

      await apiClient.saveStrategy(strategyWithId)
      setSaveSuccess(true)

      setTimeout(() => setSaveSuccess(false), 3000)
      return true
    } catch (error) {
      console.error("Error saving strategy:", error)
      alert("Failed to save strategy. Please try again.")
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const getCompletionProgress = () => {
    let completed = 0
    const total = 4

    if (strategy.entryLong.conditionGroups.length > 0) completed++
    if (strategy.entryShort.conditionGroups.length > 0) completed++
    if (strategy.exitLong.conditionGroups.length > 0) completed++
    if (strategy.exitShort.conditionGroups.length > 0) completed++

    return (completed / total) * 100
  }

  return (
    <div className={`min-h-screen hero-bg ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Enhanced Header Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Strategy Builder
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">Create your trading strategy with our visual builder</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={saveStrategy}
                disabled={isSaving}
                className="border-purple-500/20 hover:border-purple-500/30  h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className=" mr-2 h-5 w-5" />
                    Save Strategy
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  saveStrategy().then(() => {
                    router.push(`/backtest?strategy=${strategy.name}`)
                  })
                }}
                className="h-12 px-6 text-base font-semibold border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 transition-all duration-300 group"
              >
                Continue to Backtest
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-base font-semibold text-foreground">Strategy Completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {Math.round(getCompletionProgress())}%
                  </span>
                </div>
              </div>
              <Progress value={getCompletionProgress()} className="h-3 bg-background/60 border border-purple-500/20" />
              <p className="text-sm text-muted-foreground mt-2">Complete all sections to unlock backtesting</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 min-w-max lg:min-w-0 bg-background/60 backdrop-blur-xl border border-purple-500/20 p-1 h-14">
              <TabsTrigger
                value="builder"
                className="h-12 text-sm sm:text-base font-medium data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <span className="hidden sm:inline">Entry/Exit Rules</span>
                  <span className="sm:hidden">Rules</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="risk"
                className="h-12 text-sm sm:text-base font-medium data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <span className="hidden sm:inline">Risk Management</span>
                  <span className="sm:hidden">Risk</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="h-12 text-sm sm:text-base font-medium data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <span>Preview</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="h-12 text-sm sm:text-base font-medium data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <span className="hidden sm:inline">JSON Export</span>
                  <span className="sm:hidden">JSON</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="builder" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Enhanced Entry Section */}
              <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl sm:text-2xl flex items-center text-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        Entry Rules
                      </span>
                    </div>
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">Define when to enter long and short positions</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-green-400">Long Position Entry</h3>
                    </div>
                    <EntryExitNode
                      positionRule={strategy.entryLong}
                      onChange={(updatedRule) => updateStrategy({ entryLong: updatedRule })}
                      title="Long Entry"
                    />
                  </div>
                  <div className="border-t border-border/50 pt-8 space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-red-400">Short Position Entry</h3>
                    </div>
                    <EntryExitNode
                      positionRule={strategy.entryShort}
                      onChange={(updatedRule) => updateStrategy({ entryShort: updatedRule })}
                      title="Short Entry"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Exit Section */}
              <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl sm:text-2xl flex items-center text-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        Exit Rules
                      </span>
                    </div>
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">Define when to exit long and short positions</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-green-400">Long Position Exit</h3>
                    </div>
                    <EntryExitNode
                      positionRule={strategy.exitLong}
                      onChange={(updatedRule) => updateStrategy({ exitLong: updatedRule })}
                      title="Long Exit"
                    />
                  </div>
                  <div className="border-t border-border/50 pt-8 space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-red-400">Short Position Exit</h3>
                    </div>
                    <EntryExitNode
                      positionRule={strategy.exitShort}
                      onChange={(updatedRule) => updateStrategy({ exitShort: updatedRule })}
                      title="Short Exit"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl sm:text-2xl flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                      Risk Management
                    </span>
                  </div>
                </CardTitle>
                <p className="text-muted-foreground mt-2">Configure position sizing, stop losses, and risk controls</p>
              </CardHeader>
              <CardContent>
                <RiskManagement
                  config={strategy.riskManagement}
                  onChange={(updatedConfig) => updateStrategy({ riskManagement: updatedConfig })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      Strategy Preview
                    </span>
                  </div>
                </CardTitle>
                <p className="text-muted-foreground mt-2">Review your complete strategy configuration</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-background/40 border border-purple-500/20">
                      <div className="text-sm text-muted-foreground">Entry Conditions</div>
                      <div className="text-2xl font-bold text-green-400">
                        {strategy.entryLong.conditionGroups.length + strategy.entryShort.conditionGroups.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-background/40 border border-purple-500/20">
                      <div className="text-sm text-muted-foreground">Exit Conditions</div>
                      <div className="text-2xl font-bold text-orange-400">
                        {strategy.exitLong.conditionGroups.length + strategy.exitShort.conditionGroups.length}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-background/40 border border-purple-500/20">
                      <div className="text-sm text-muted-foreground">Risk Rules</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {(strategy.riskManagement.stopLoss?.length || 0) +
                          (strategy.riskManagement.takeProfit?.length || 0)}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-background/40 border border-purple-500/20">
                      <div className="text-sm text-muted-foreground">Completion</div>
                      <div className="text-2xl font-bold text-purple-400">{Math.round(getCompletionProgress())}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json">
            <StrategyJsonExporter strategy={strategy} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
