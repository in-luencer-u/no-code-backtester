"use client"

import { useState, useEffect } from "react"
import {
  Save,
  ArrowRight,
  Loader2,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  Zap,
  AlertCircle,
  Clock,
  Target,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cleanPositionRule } from "./strategy-builder/utils"
import type { IndicatorCondition, ConditionGroup, PositionRule } from "@/components/strategy-builder/types"
import EntryExitNode from "@/components/strategy-builder/entry-exit-node"
import RiskManagement from "./strategy-builder/risk-management/risk-management-main"
import type { RiskManagementConfig } from "@/components/strategy-builder/types"
import { useStrategy } from "@/context/strategy-context"
import EnhancedFeedbackSection from "@/components/enhanced-feedback-section"

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
  indicator: "rsi",
  logic: "less_than",
  value: "30",
  timeframe: "1d",
  params: {
    period: 14,
    source: "close",
  } as const,
}

const defaultConditionGroup: ConditionGroup = {
  id: generateId("group"),
  conditions: [{ ...defaultCondition, id: generateId("condition") }],
  operator: "or",
}

const defaultPositionRule: PositionRule = {
  id: generateId("rule"),
  conditionGroups: [{ ...defaultConditionGroup, id: generateId("group") }],
}

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
  description: "A simple trading strategy based on technical indicators",
  entryLong: { ...defaultPositionRule, id: generateId("entry-long") },
  entryShort: { ...defaultPositionRule, id: generateId("entry-short") },
  exitLong: { ...defaultPositionRule, id: generateId("exit-long") },
  exitShort: { ...defaultPositionRule, id: generateId("exit-short") },
  riskManagement: defaultRiskManagement,
  isPublic: false,
}

// Function to create API client for backend communication
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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] },
}

export default function StrategyBuilder() {
  const [activeTab, setActiveTab] = useState("builder")
  const [strategy, setStrategy] = useState<StrategyConfig>(defaultStrategy)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const router = useRouter()
  const { setStrategyName, setStrategyId, setIsPublic, setIndicators } = useStrategy()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Convert string properties to number for preview compatibility
  function convertRiskRuleStringsToNumbers<T extends Record<string, any>>(rule: T): T {
    const numericFields = [
      "value",
      "atrPeriod",
      "atrMultiplier",
      "lookbackPeriod",
      "riskRewardRatio",
      "activationThreshold",
      "accelerationFactor",
      "maxAcceleration",
      "maPeriod",
      "equityPercentage",
      "riskPerTrade",
      "winRate",
      "payoffRatio",
      "optimalFraction",
      "volatilityPeriod",
      "volatilityMultiplier",
      "martingaleFactor",
    ]

    const converted = { ...rule } as T
    for (const field of numericFields) {
      if (field in converted && converted[field] !== undefined) {
        const num = Number.parseFloat(converted[field])
        if (!isNaN(num)) {
          ;(converted as any)[field] = num
        }
      }
    }
    return converted
  }

  // Utility to deeply convert all risk rule arrays in a strategy config
  function convertStrategyForPreview(strategy: StrategyConfig): StrategyConfig {
    return {
      ...strategy,
      riskManagement: {
        ...strategy.riskManagement,
        stopLoss: strategy.riskManagement.stopLoss.map(convertRiskRuleStringsToNumbers),
        takeProfit: strategy.riskManagement.takeProfit.map(convertRiskRuleStringsToNumbers),
        trailingStop: strategy.riskManagement.trailingStop.map(convertRiskRuleStringsToNumbers),
        positionSizing: strategy.riskManagement.positionSizing.map(convertRiskRuleStringsToNumbers),
        timeExit: strategy.riskManagement.timeExit.map(convertRiskRuleStringsToNumbers),
      },
    }
  }

  // Prepare strategy for preview with number conversion
  const strategyForPreview = convertStrategyForPreview(strategy)

  const updateStrategy = (newStrategy: Partial<StrategyConfig>) => {
    setStrategy({ ...strategy, ...newStrategy })
    setSaveError(null) // Clear any previous errors when user makes changes
  }

  const saveStrategy = async () => {
    try {
      setIsSaving(true)
      setSaveSuccess(false)
      setSaveError(null)

      // Store strategy data in context
      setStrategyName(strategy.name)
      setStrategyId(strategy.id || generateId("strategy"))
      setIsPublic(strategy.isPublic || false)

      // Collect all indicators used in the strategy
      const indicators = new Set<string>()

      // Helper function to collect indicators from condition groups
      const collectIndicators = (positionRule: PositionRule) => {
        positionRule.conditionGroups.forEach((group) => {
          group.conditions.forEach((condition) => {
            indicators.add(condition.indicator)
          })
        })
      }
      const cleanedStrategy = {
        ...strategy,
        entryLong: cleanPositionRule(strategy.entryLong),
        entryShort: cleanPositionRule(strategy.entryShort),
        exitLong: cleanPositionRule(strategy.exitLong),
        exitShort: cleanPositionRule(strategy.exitShort),
      }
      await apiClient.saveStrategy(cleanedStrategy)

      setSaveSuccess(true)
      setLastSaved(new Date())
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

  // Calculate completion progress
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

  // Get strategy validation status
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

  const validationStatus = getValidationStatus()

  return (
    <div className={`min-h-screen hero-bg ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Enhanced Header Section */}
        <motion.div
          className="mb-8 space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate={isVisible ? "animate" : "initial"}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <motion.div className="space-y-3" variants={fadeInUp}>
              <div className="flex items-center space-x-3">
                <motion.div
                  className="h-3 w-3 bg-purple-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Strategy Builder
                </h1>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                >
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </motion.div>
              </div>
              <p className="text-muted-foreground text-lg">Create your trading strategy with our visual builder</p>
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-3" variants={fadeInUp}>
              <Button
                onClick={saveStrategy}
                disabled={isSaving}
                className="btn-primary group h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
                    <Save className="mr-2 h-5 w-5" />
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
                disabled={!validationStatus.isValid}
                className="h-12 px-6 text-base font-semibold border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Backtest
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Progress and Status Section */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={fadeInUp}>
            {/* Progress Card */}
            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="h-2 w-2 bg-purple-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span className="text-base font-semibold text-foreground">Strategy Completion</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      {validationStatus.score}%
                    </span>
                    <Badge
                      variant="outline"
                      className={`border-purple-500/30 ${validationStatus.isValid ? "text-green-400 border-green-500/30" : "text-purple-300"}`}
                    >
                      {validationStatus.isValid ? "Ready" : "In Progress"}
                    </Badge>
                  </div>
                </div>
                <Progress value={validationStatus.score} className="h-3 bg-background/60 border border-purple-500/20" />
                <p className="text-sm text-muted-foreground mt-2">
                  {validationStatus.isValid
                    ? "Strategy is ready for backtesting!"
                    : "Complete all sections to unlock backtesting"}
                </p>
              </CardContent>
            </Card>

            {/* Status and Feedback Card */}
            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    <span className="text-base font-semibold text-foreground">Strategy Status</span>
                  </div>
                  {lastSaved && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Saved {lastSaved.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {validationStatus.isValid ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Strategy is complete and valid</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-orange-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {validationStatus.issues.length} items need attention
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {validationStatus.issues.slice(0, 2).map((issue, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <span>•</span>
                            <span>{issue}</span>
                          </div>
                        ))}
                        {validationStatus.issues.length > 2 && (
                          <div className="text-purple-400">+{validationStatus.issues.length - 2} more...</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Feedback Alerts */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-green-500/30 bg-green-500/10 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    Strategy saved successfully! Your changes have been preserved.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-red-500/30 bg-red-500/10 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{saveError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Strategy Details Card */}
        <motion.div className="mb-8" variants={fadeInUp} initial="initial" animate={isVisible ? "animate" : "initial"}>
          <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Settings className="h-6 w-6 text-purple-400" />
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    Strategy Configuration
                  </CardTitle>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Configure your strategy details and visibility settings
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="strategy-name" className="text-sm font-medium flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span>Strategy Name</span>
                    </Label>
                    <Input
                      id="strategy-name"
                      value={strategy.name}
                      onChange={(e) => updateStrategy({ name: e.target.value })}
                      placeholder="Enter strategy name"
                      className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="strategy-description" className="text-sm font-medium flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-purple-400" />
                      <span>Description</span>
                    </Label>
                    <Textarea
                      id="strategy-description"
                      value={strategy.description}
                      onChange={(e) => updateStrategy({ description: e.target.value })}
                      placeholder="Describe your strategy"
                      className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/40 border border-purple-500/20">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <Label htmlFor="public-strategy" className="text-sm font-medium">
                        Make Strategy Public
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Public strategies appear in the templates for other users
                    </p>
                  </div>
                  <Switch
                    id="public-strategy"
                    checked={strategy.isPublic || false}
                    onCheckedChange={(checked) => updateStrategy({ isPublic: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div variants={fadeInUp} initial="initial" animate={isVisible ? "animate" : "initial"}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-2 min-w-max lg:min-w-0 bg-background/60 backdrop-blur-xl border border-purple-500/20 p-1 h-14">
                <TabsTrigger
                  value="builder"
                  className="h-12 text-sm sm:text-base font-medium data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Entry/Exit Rules</span>
                    <span className="sm:hidden">Rules</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="risk"
                  className="h-12 text-sm sm:text-base font-medium data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40 transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Risk Management</span>
                    <span className="sm:hidden">Risk</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="builder" className="space-y-8">
              <motion.div
                key="builder-content"
                variants={slideIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 xl:grid-cols-2 gap-8"
              >
                {/* Enhanced Entry Section */}
                <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl sm:text-2xl flex items-center text-foreground">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="h-3 w-3 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
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
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Exit Section */}
                <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl sm:text-2xl flex items-center text-foreground">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="h-3 w-3 bg-orange-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                        />
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
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <motion.div key="risk-content" variants={slideIn} initial="initial" animate="animate" exit="exit">
                <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-lg">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl sm:text-2xl flex items-center">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="h-3 w-3 bg-yellow-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                        />
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                          Risk Management
                        </span>
                      </div>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                      Configure position sizing, stop losses, and risk controls
                    </p>
                  </CardHeader>
                  <CardContent>
                    <RiskManagement
                      config={strategy.riskManagement}
                      onChange={(updatedConfig) => updateStrategy({ riskManagement: updatedConfig })}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* ENHANCED FEEDBACK SECTION - This replaces the basic one you showed me */}
        <motion.div
          className="mt-16 mb-8"
          variants={fadeInUp}
          initial="initial"
          animate={isVisible ? "animate" : "initial"}
        >
          <EnhancedFeedbackSection />
        </motion.div>
      </div>
    </div>
  )
}
