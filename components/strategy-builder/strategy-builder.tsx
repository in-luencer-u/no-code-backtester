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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Strategy Builder</h1>
              <p className="text-muted-foreground">Create your trading strategy with our visual builder</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={saveStrategy} disabled={isSaving} className="btn-primary group">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
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
                className="border-primary/20 hover:bg-primary/5 group"
              >
                Continue to Backtest
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="border-purple-500/20 glow-purple">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Strategy Completion</span>
                <span className="text-sm text-muted-foreground">{Math.round(getCompletionProgress())}%</span>
              </div>
              <Progress value={getCompletionProgress()} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Mobile-First Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="tabs-list grid w-full grid-cols-2 lg:grid-cols-4 min-w-max lg:min-w-0">
              <TabsTrigger value="builder" className="tab-trigger text-xs sm:text-sm">
                Entry/Exit Rules
              </TabsTrigger>
              <TabsTrigger value="risk" className="tab-trigger text-xs sm:text-sm">
                Risk Management
              </TabsTrigger>
              <TabsTrigger value="preview" className="tab-trigger text-xs sm:text-sm">
                Preview
              </TabsTrigger>
              <TabsTrigger value="json" className="tab-trigger text-xs sm:text-sm">
                JSON Export
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Entry Section */}
              <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl flex items-center text-foreground">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                    Entry Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 card-content">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-400">Long Position</h3>
                    <EntryExitNode
                      positionRule={strategy.entryLong}
                      onChange={(updatedRule) => updateStrategy({ entryLong: updatedRule })}
                      title="Long Position"
                    />
                  </div>
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-red-400">Short Position</h3>
                    <EntryExitNode
                      positionRule={strategy.entryShort}
                      onChange={(updatedRule) => updateStrategy({ entryShort: updatedRule })}
                      title="Short Position"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Exit Section */}
              <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl flex items-center text-foreground">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                    Exit Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 card-content">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-400">Long Position</h3>
                    <EntryExitNode
                      positionRule={strategy.exitLong}
                      onChange={(updatedRule) => updateStrategy({ exitLong: updatedRule })}
                      title="Long Position"
                    />
                  </div>
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-red-400">Short Position</h3>
                    <EntryExitNode
                      positionRule={strategy.exitShort}
                      onChange={(updatedRule) => updateStrategy({ exitShort: updatedRule })}
                      title="Short Position"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mr-3"></div>
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RiskManagement
                  config={strategy.riskManagement}
                  onChange={(updatedConfig) => updateStrategy({ riskManagement: updatedConfig })}
                />
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
