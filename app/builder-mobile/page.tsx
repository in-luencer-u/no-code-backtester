"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  TrendingUp,
  Shield,
  Settings,
  Sparkles,
  Target,
  AlertCircle,
  Play,
  Loader2,
  TrendingDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStrategy } from "@/context/strategy-context"
import MobileStrategyDetails from "./components/mobile-strategy-details"
import MobileEntryExitBuilder from "./components/mobile-entry-exit-builder"
import MobileRiskManagement from "./components/mobile-risk-management"
import MobileLongEntryRules from "./components/mobile-long-entry-rules"
import MobileShortEntryRules from "./components/mobile-short-entry-rules"
import MobileLongExitRules from "./components/mobile-long-exit-rules"
import MobileShortExitRules from "./components/mobile-short-exit-rules"
import type { StrategyConfig } from "@/components/strategy-builder/strategy-builder"
import type { IndicatorCondition } from "@/components/strategy-builder/types"

// Mobile-optimized step configuration
const MOBILE_STEPS = [
  {
    id: "details",
    title: "Strategy Details",
    icon: Settings,
    description: "Name and configure your strategy",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "long-entry",
    title: "Long Entry Rules",
    icon: TrendingUp,
    description: "When to buy/go long",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    id: "short-entry",
    title: "Short Entry Rules",
    icon: TrendingDown,
    description: "When to sell/go short",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    id: "long-exit",
    title: "Long Exit Rules",
    icon: TrendingUp,
    description: "When to close long positions",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "short-exit",
    title: "Short Exit Rules",
    icon: TrendingDown,
    description: "When to close short positions",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "risk",
    title: "Risk Management",
    icon: Shield,
    description: "Configure position sizing and risk",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: "review",
    title: "Review & Save",
    icon: CheckCircle,
    description: "Review and save your strategy",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
]

// API client for strategy operations
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
}

// Default strategy configuration
const defaultStrategy: StrategyConfig = {
  id: `strategy-${Date.now()}`,
  name: "My Mobile Strategy",
  description: "A trading strategy built on mobile",
  entryLong: {
    id: `entry-long-${Date.now()}`,
    conditionGroups: [
      {
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
      },
    ],
  },
  entryShort: {
    id: `entry-short-${Date.now()}`,
    conditionGroups: [
      {
        id: `group-${Date.now()}`,
        conditions: [
          {
            id: `condition-${Date.now()}`,
            indicator: "rsi",
            logic: "greater_than",
            value: "70",
            timeframe: "1d",
            params: { period: 14, source: "close" },
          },
        ],
        operator: "or",
      },
    ],
  },
  exitLong: {
    id: `exit-long-${Date.now()}`,
    conditionGroups: [
      {
        id: `group-${Date.now()}`,
        conditions: [
          {
            id: `condition-${Date.now()}`,
            indicator: "rsi",
            logic: "greater_than",
            value: "70",
            timeframe: "1d",
            params: { period: 14, source: "close" },
          },
        ],
        operator: "or",
      },
    ],
  },
  exitShort: {
    id: `exit-short-${Date.now()}`,
    conditionGroups: [
      {
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
      },
    ],
  },
  riskManagement: {
    stopLoss: [{ id: "sl-default", type: "percentage", value: 2, enabled: true }],
    takeProfit: [{ id: "tp-default", type: "percentage", value: 5, enabled: true }],
    trailingStop: [],
    positionSizing: [{ id: "ps-default", type: "percentage", value: 2, enabled: true }],
    timeExit: [],
    maxOpenPositions: 3,
    maxDrawdown: 15,
    maxDailyLoss: 5,
    maxConsecutiveLosses: 3,
    profitTarget: 20,
    riskRewardMinimum: 1.5,
    pyramiding: 0,
    experienceLevel: "beginner",
  },
  isPublic: false,
}

// Helper to map conditions and include secondaryIndicator
const mapConditions = (conditions: IndicatorCondition[]): IndicatorCondition[] =>
  conditions.map((condition: IndicatorCondition) => ({
    ...condition,
    params: condition.params || {},
    ...(condition.secondaryIndicator ? { secondaryIndicator: condition.secondaryIndicator } : {}),
  }))

export default function MobileBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [strategy, setStrategy] = useState<StrategyConfig>(defaultStrategy)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { setStrategyName, setStrategyId, setIsPublic, setIndicators } = useStrategy()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const updateStrategy = (newStrategy: Partial<StrategyConfig>) => {
    setStrategy({ ...strategy, ...newStrategy })
    setSaveError(null)
  }

  const saveStrategy = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(false)
      setSaveError(null)

      // Prepare strategy data with proper formatting
      const strategyWithId = {
        ...strategy,
        id: strategy.id || `strategy-${Date.now()}`,
        entryLong: {
          ...strategy.entryLong,
          conditionGroups: strategy.entryLong.conditionGroups.map((group) => ({
            ...group,
            conditions: mapConditions(group.conditions),
          })),
        },
        entryShort: {
          ...strategy.entryShort,
          conditionGroups: strategy.entryShort.conditionGroups.map((group) => ({
            ...group,
            conditions: mapConditions(group.conditions),
          })),
        },
        exitLong: {
          ...strategy.exitLong,
          conditionGroups: strategy.exitLong.conditionGroups.map((group) => ({
            ...group,
            conditions: mapConditions(group.conditions),
          })),
        },
        exitShort: {
          ...strategy.exitShort,
          conditionGroups: strategy.exitShort.conditionGroups.map((group) => ({
            ...group,
            conditions: mapConditions(group.conditions),
          })),
        },
      }

      // Store strategy data in context
      setStrategyName(strategyWithId.name)
      setStrategyId(strategyWithId.id)
      setIsPublic(strategyWithId.isPublic || false)

      // Collect indicators for context
      const indicators = new Set<string>()
      const collectIndicators = (positionRule: any) => {
        positionRule.conditionGroups.forEach((group: any) => {
          group.conditions.forEach((condition: any) => {
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

      // Save to API
      await apiClient.saveStrategy(strategyWithId)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      return true
    } catch (error) {
      console.error("Error saving strategy:", error)
      setSaveError("Failed to save strategy. Please try again.")
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const getCompletionProgress = () => {
    let completed = 0
    const total = 6

    if (strategy.name.trim()) completed++
    if (strategy.description.trim()) completed++
    if (strategy.entryLong.conditionGroups.length > 0) completed++
    if (strategy.entryShort.conditionGroups.length > 0) completed++
    if (strategy.exitLong.conditionGroups.length > 0) completed++
    if (strategy.exitShort.conditionGroups.length > 0) completed++

    return (completed / total) * 100
  }

  const getValidationStatus = () => {
    const issues = []
    if (!strategy.name.trim()) issues.push("Strategy name is required")
    if (!strategy.description.trim()) issues.push("Strategy description is required")
    if (strategy.entryLong.conditionGroups.length === 0) issues.push("Long entry rules are required")
    if (strategy.exitLong.conditionGroups.length === 0) issues.push("Long exit rules are required")

    return {
      isValid: issues.length === 0,
      issues,
      score: Math.round(getCompletionProgress()),
    }
  }

  const nextStep = () => {
    if (currentStep < MOBILE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToBacktest = async () => {
    const saved = await saveStrategy()
    if (saved) {
      router.push(`/backtest?strategy=${strategy.name}`)
    }
  }

  const validationStatus = getValidationStatus()
  const currentStepData = MOBILE_STEPS[currentStep]

  return (
    <div className={`min-h-screen hero-bg ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-purple-500/20 shadow-md">
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5 text-purple-400" />
            </motion.button>
            <div className="flex flex-col items-center flex-1">
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Trade-Craft Builder
              </h1>
              <span className="text-xs text-muted-foreground font-medium">Mobile Strategy Creation</span>
            </div>
            {/* Contextual icon: show checkmark on review step, gear/settings on others */}
            <motion.div
              className="p-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep === MOBILE_STEPS.length - 1 ? (
                <CheckCircle className="h-5 w-5 text-green-400" aria-label="Review" />
              ) : (
                <Settings className="h-5 w-5 text-purple-400" aria-label="Settings" />
              )}
            </motion.div>
          </div>
          {/* Dynamic Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Step {currentStep + 1} of {MOBILE_STEPS.length}</span>
              <span className="text-purple-400 font-medium">{Math.round(((currentStep + 1) / MOBILE_STEPS.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / MOBILE_STEPS.length) * 100} className="h-2 bg-background/60" />
          </div>
          {/* Stepper Dots */}
          <div className="flex items-center justify-center mt-2 space-x-2">
            {MOBILE_STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-purple-500"
                    : index < currentStep
                      ? "w-2 bg-purple-400"
                      : "w-2 bg-purple-500/30"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Alerts */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 z-40"
          >
            <Alert className="border-green-500/30 bg-green-500/10 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Strategy saved successfully!</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 z-40"
          >
            <Alert className="border-red-500/30 bg-red-500/10 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Current Step Header */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={currentStep}>
          <Card className={`border-purple-500/20 bg-background/60 backdrop-blur-xl`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${currentStepData.bgColor} border border-purple-500/30`}>
                  <currentStepData.icon className={`h-5 w-5 ${currentStepData.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground">{currentStepData.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
                </div>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  {currentStep + 1}/{MOBILE_STEPS.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentStep === 0 && <MobileStrategyDetails strategy={strategy} onChange={updateStrategy} />}
            {currentStep === 1 && <MobileLongEntryRules positionRule={strategy.entryLong} onChange={rule => updateStrategy({ entryLong: rule })} />}
            {currentStep === 2 && <MobileShortEntryRules positionRule={strategy.entryShort} onChange={rule => updateStrategy({ entryShort: rule })} />}
            {currentStep === 3 && <MobileLongExitRules positionRule={strategy.exitLong} onChange={rule => updateStrategy({ exitLong: rule })} />}
            {currentStep === 4 && <MobileShortExitRules positionRule={strategy.exitShort} onChange={rule => updateStrategy({ exitShort: rule })} />}
            {currentStep === 5 && <MobileRiskManagement strategy={strategy} onChange={updateStrategy} />}
            {currentStep === 6 && (
              <div className="space-y-6">
                {/* Strategy Summary */}
                <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-400" />
                      <span>Strategy Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium text-foreground">{strategy.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm font-medium text-foreground">{strategy.isPublic ? "Public" : "Private"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm text-foreground">{strategy.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Entry/Exit Rules Summary */}
                {[{
                  label: "Long Entry Rules",
                  rule: strategy.entryLong,
                  color: "green"
                }, {
                  label: "Short Entry Rules",
                  rule: strategy.entryShort,
                  color: "red"
                }, {
                  label: "Long Exit Rules",
                  rule: strategy.exitLong,
                  color: "orange"
                }, {
                  label: "Short Exit Rules",
                  rule: strategy.exitShort,
                  color: "orange"
                }].map(({ label, rule, color }, idx) => (
                  <Card key={label} className={`border-${color}-500/20 bg-background/60 backdrop-blur-xl`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center space-x-2 text-${color}-400`}>
                        <span>{label}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {rule.conditionGroups.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No rules defined.</p>
                      ) : (
                        rule.conditionGroups.map((group, gIdx) => (
                          <div key={group.id} className="border rounded-lg p-3 mb-2 border-dashed border-muted-foreground/10 bg-background/70">
                            <div className="flex items-center mb-2">
                              <span className={`h-2 w-2 rounded-full mr-2 bg-${color}-400`} />
                              <span className="text-xs font-semibold">Condition Group {gIdx + 1} ({group.operator.toUpperCase()})</span>
                              <span className="ml-2 text-xs text-muted-foreground">{group.conditions.length} rule{group.conditions.length !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="space-y-2 ml-4">
                              {group.conditions.map((cond, cIdx) => (
                                <div key={cond.id} className="text-xs border-l-2 pl-2 border-dotted border-muted-foreground/20">
                                  <div className="font-medium text-foreground">Rule {cIdx + 1}</div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    <span><b>Indicator:</b> {cond.indicator}</span>
                                    <span><b>Logic:</b> {cond.logic}</span>
                                    {cond.value !== undefined && <span><b>Value:</b> {cond.value}</span>}
                                    <span><b>Timeframe:</b> {cond.timeframe}</span>
                                  </div>
                                  {cond.params && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 ml-2">
                                      {Object.entries(cond.params).map(([k, v]) => (
                                        <span key={k}><b>{k}:</b> {String(v)}</span>
                                      ))}
                                    </div>
                                  )}
                                  {cond.secondaryIndicator && (
                                    <div className="ml-2 text-xs text-muted-foreground">
                                      <b>Secondary Indicator:</b> {JSON.stringify(cond.secondaryIndicator)}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Risk Management Summary */}
                <Card className="border-yellow-500/20 bg-background/60 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-yellow-400">
                      <Shield className="h-5 w-5" />
                      <span>Risk Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Stop Loss:</span>
                        <span className="text-foreground">{strategy.riskManagement.stopLoss?.[0]?.value ?? "-"} ({strategy.riskManagement.stopLoss?.[0]?.type ?? "-"})</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Take Profit:</span>
                        <span className="text-foreground">{strategy.riskManagement.takeProfit?.[0]?.value ?? "-"} ({strategy.riskManagement.takeProfit?.[0]?.type ?? "-"})</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Position Sizing:</span>
                        <span className="text-foreground">{strategy.riskManagement.positionSizing?.[0]?.value ?? "-"} ({strategy.riskManagement.positionSizing?.[0]?.type ?? "-"})</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Max Open Positions:</span>
                        <span className="text-foreground">{strategy.riskManagement.maxOpenPositions}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Max Drawdown:</span>
                        <span className="text-foreground">{strategy.riskManagement.maxDrawdown}%</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Max Daily Loss:</span>
                        <span className="text-foreground">{strategy.riskManagement.maxDailyLoss}%</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Max Consecutive Losses:</span>
                        <span className="text-foreground">{strategy.riskManagement.maxConsecutiveLosses}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Profit Target:</span>
                        <span className="text-foreground">{strategy.riskManagement.profitTarget}%</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Min Risk:Reward:</span>
                        <span className="text-foreground">{strategy.riskManagement.riskRewardMinimum}:1</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Pyramiding:</span>
                        <span className="text-foreground">{strategy.riskManagement.pyramiding}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Experience Level:</span>
                        <span className="text-foreground">{strategy.riskManagement.experienceLevel}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Validation Status */}
                <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Strategy Validation</span>
                      <Badge
                        variant="outline"
                        className={`${validationStatus.isValid ? "border-green-500/30 text-green-400" : "border-orange-500/30 text-orange-400"}`}
                      >
                        {validationStatus.isValid ? "Ready" : "Incomplete"}
                      </Badge>
                    </div>
                    {!validationStatus.isValid && (
                      <div className="space-y-2">
                        {validationStatus.issues.slice(0, 3).map((issue, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <div className="h-1 w-1 bg-orange-400 rounded-full" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-purple-300">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={saveStrategy}
                          disabled={isSaving}
                          className="btn-primary disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-3 w-3 mr-1" />
                              Save Strategy
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={goToBacktest}
                          disabled={!validationStatus.isValid}
                          className="btn-primary disabled:opacity-50"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Backtest
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-purple-500/20 p-4">
        <div className="flex items-center justify-between space-x-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1 border-purple-500/30 text-purple-200 hover:bg-purple-500/10 disabled:opacity-50 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === MOBILE_STEPS.length - 1 ? (
            <Button
              onClick={goToBacktest}
              disabled={!validationStatus.isValid}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              <Play className="h-4 w-4 mr-2" />
              Backtest
            </Button>
          ) : (
            <Button onClick={nextStep} className="flex-1 btn-primary">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
