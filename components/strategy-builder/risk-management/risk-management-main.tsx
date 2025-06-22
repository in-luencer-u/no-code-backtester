"use client"

import { useState } from "react"
import { Shield, TrendingUp, Settings, AlertTriangle } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PositionSizingSection } from "./PositionSizingSection"
import { TimeExitSection } from "./TimeExitSection"
import {
  useStopLossRules,
  useTakeProfitRules,
  useTrailingStopRules,
  useTimeExitRules,
  usePositionSizingRules,
} from "./risk-management-hooks"
import type { RiskManagementConfig } from "../types"
import { LeverageSection } from "./LeverageSection"
import { StopLossSection } from "./StopLossSection"
import { TakeProfitSection } from "./TakeProfitSection"
import { MaxDrawdownSection } from "./MaxDrawdownSection"
import { MaxTradesSection } from "./MaxTradesSection"
import { MaxPositionsSection } from "./MaxPositionsSection"
import { TradingSessionFilterSection } from "./TradingSessionFilterSection"

// Base Rule type
type Rule = {
  id: string;
  enabled: boolean;
  [key: string]: any;
};

// Risk Rule Types
export type StopLossRule = {
  id: string
  type: "percentage" | "atr" | "fixed-dollar" | "time"
  value: number
  atrPeriod?: number
  atrMultiplier?: number
  lookbackPeriod?: number
  enabled: boolean
  customFormula?: string
  useStopLossRisk?: boolean
}

export type TakeProfitRule = {
  id: string
  type: "percentage" | "r:r" | "atr" | "trailing"
  value: number
  atrPeriod?: number
  atrMultiplier?: number
  riskRewardRatio?: number
  lookbackPeriod?: number
  enabled: boolean
}

export type TrailingStopRule = {
  id: string
  type: "percentage" | "atr" | "volatility" | "parabolic" | "moving-average" | "custom"
  value: number
  activationThreshold?: number
  atrPeriod?: number
  atrMultiplier?: number
  accelerationFactor?: number
  maxAcceleration?: number
  maType?: "sma" | "ema" | "wma"
  maPeriod?: number
  enabled: boolean
}

export type PositionSizingRule = {
  id: string
  type:
    | "fixed-units"
    | "fixed-amount"
    | "percentage"
    | "risk-based"
    | "risk-reward"
    | "kelly"
    | "optimal-f"
    | "volatility-based"
    | "custom"
  value: number
  enabled: boolean
  // Type-specific fields
  equityPercentage?: number // Only for percentage type
  riskPerTrade?: number // Only for risk-based type
  winRate?: number // Only for kelly type
  payoffRatio?: number // Only for kelly type
  optimalFraction?: number
  volatilityPeriod?: number
  volatilityMultiplier?: number
  customFormula?: string
  useStopLossRisk?: boolean
}

export type TimeExitRule = {
  id: string
  type: "bars" | "time" | "date" | "session-end" | "custom"
  value: number
  enabled: boolean
}

// Type for the return value of risk management hooks
type RiskManagementHookResult = {
  rules: Rule[];
  addRule: () => void;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  removeRule: (id:string) => void;
  toggleRule: (id:string) => void;
} | undefined;

interface RiskManagementProps {
  config: RiskManagementConfig
  onChange: (config: RiskManagementConfig) => void
}

export default function RiskManagement({ config, onChange }: RiskManagementProps) {
  const [activeTab, setActiveTab] = useState("position-sizing")

  const updateConfig = (newConfig: Partial<RiskManagementConfig>) => {
    onChange({ ...config, ...newConfig })
  }

  // Use modular hooks
  const stopLossRules = useStopLossRules(config, updateConfig)
  const takeProfitRules = useTakeProfitRules(config, updateConfig)
  const trailingStopRules = useTrailingStopRules(config, updateConfig)
  const timeExitRules = useTimeExitRules(config, updateConfig)
  const positionSizingRules = usePositionSizingRules(config, updateConfig)

  // Calculate active rules count for badges
  const getActiveRulesCount = (rules: any[]) => {
    return rules ? rules.filter((rule) => rule.enabled).length : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-purple-400" />
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Risk Management Settings
              </CardTitle>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Configure how your strategy manages risk and position sizing to protect your capital
          </p>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-3 min-w-max lg:min-w-0 bg-background/60 backdrop-blur-xl border border-purple-500/20">
            <TabsTrigger
              value="position-sizing"
              className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all duration-200"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Position Sizing</span>
              <span className="sm:hidden">Sizing</span>
              {getActiveRulesCount(config.positionSizing) > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 text-xs bg-purple-500/30 text-purple-300 border-purple-500/40"
                >
                  {getActiveRulesCount(config.positionSizing)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="exit-rules"
              className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all duration-200"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Exit Rules</span>
              <span className="sm:hidden">Exits</span>
              {getActiveRulesCount(config.stopLoss) +
                getActiveRulesCount(config.takeProfit) +
                getActiveRulesCount(config.timeExit) >
                0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 text-xs bg-purple-500/30 text-purple-300 border-purple-500/40"
                >
                  {getActiveRulesCount(config.stopLoss) +
                    getActiveRulesCount(config.takeProfit) +
                    getActiveRulesCount(config.timeExit)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
              <span className="sm:hidden">More</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Position Sizing Tab */}
        <TabsContent value="position-sizing" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span>Position Sizing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PositionSizingSection config={config} positionSizingRules={positionSizingRules} />
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-purple-400" />
                  <span>Leverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeverageSection config={config} updateConfig={updateConfig} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exit Rules Tab */}
        <TabsContent value="exit-rules" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <span>Stop Loss</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StopLossSection config={config} stopLossRules={stopLossRules} />
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>Take Profit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TakeProfitSection config={config} takeProfitRules={takeProfitRules} />
              </CardContent>
            </Card>
          </div>

          <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-400" />
                <span>Time-Based Exits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimeExitSection config={config} timeExitRules={timeExitRules} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  <span>Max Drawdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MaxDrawdownSection config={config} updateConfig={updateConfig} />
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  <span>Trade Limits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MaxTradesSection config={config} updateConfig={updateConfig} />
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <span>Position Limits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MaxPositionsSection config={config} updateConfig={updateConfig} />
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-purple-400" />
                  <span>Trading Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TradingSessionFilterSection config={config} updateConfig={updateConfig} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
