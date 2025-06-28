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
import type { StrategyConfig } from "../strategy-builder/strategy-builder.tsx"


// Mobile-optimized step configuration
const MOBILE_STEPS = [
  {
    id: "details",
    title: "Strategy Details",
    icon: Settings,
    description: "Name and configure your strategy",
  },
  {
    id: "entry-exit",
    title: "Entry & Exit Rules",
    icon: TrendingUp,
    description: "Set your trading conditions",
  },
  {
    id: "risk",
    title: "Risk Management",
    icon: Shield,
    description: "Configure position sizing and risk",
  },
  {
    id: "review",
    title: "Review & Save",
    icon: CheckCircle,
    description: "Review and save your strategy",
  },
]

// Default strategy configuration (same as desktop)
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

export default function MobileBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [strategy, setStrategy] = useState<StrategyConfig>(defaultStrategy)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { setStrategyName, setStrategyId, setIsPublic } = useStrategy()

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

      // Store strategy data in context
      setStrategyName(strategy.name)
      setStrategyId(strategy.id)
      setIsPublic(strategy.isPublic || false)

      // Simulate API call (replace with actual API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

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
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-purple-500/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <motion.button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 text-purple-400" />
            </motion.button>

            <div className="text-center">
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Strategy Builder
              </h1>
              <p className="text-xs text-muted-foreground">Mobile Optimized</p>
            </div>

            <motion.button
              onClick={saveStrategy}
              disabled={isSaving}
              className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSaving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </motion.div>
              ) : saveSuccess ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Save className="h-5 w-5 text-purple-400" />
              )}
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-purple-400 font-medium">{validationStatus.score}%</span>
            </div>
            <Progress value={validationStatus.score} className="h-2 bg-background/60" />
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mt-4 space-x-2">
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
                transition={{ delay: index * 0.1 }}
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
          <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <currentStepData.icon className="h-5 w-5 text-purple-400" />
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
            {currentStep === 1 && <MobileEntryExitBuilder strategy={strategy} onChange={updateStrategy} />}
            {currentStep === 2 && <MobileRiskManagement strategy={strategy} onChange={updateStrategy} />}
            {currentStep === 3 && (
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-sm font-medium text-foreground">{strategy.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm font-medium text-foreground">
                          {strategy.isPublic ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm text-foreground">{strategy.description}</p>
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
                        className={`${
                          validationStatus.isValid
                            ? "border-green-500/30 text-green-400"
                            : "border-orange-500/30 text-orange-400"
                        }`}
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
