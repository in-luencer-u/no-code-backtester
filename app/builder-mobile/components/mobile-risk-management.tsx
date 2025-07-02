"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, TrendingUp, Settings, AlertTriangle, Target, DollarSign, Clock, BarChart3, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { StrategyConfig } from "@/components/strategy-builder/strategy-builder"

interface MobileRiskManagementProps {
  strategy: StrategyConfig
  onChange: (strategy: Partial<StrategyConfig>) => void
}

export default function MobileRiskManagement({ strategy, onChange }: MobileRiskManagementProps) {
  const [activeTab, setActiveTab] = useState("position")
  const [expandedSections, setExpandedSections] = useState<string[]>(["stop-loss"])

  const updateRiskManagement = (updates: any) => {
    onChange({
      riskManagement: {
        ...strategy.riskManagement,
        ...updates,
      },
    })
  }

  const updateStopLoss = (updates: any) => {
    const stopLoss = strategy.riskManagement.stopLoss[0] || {
      id: "sl-default",
      type: "percentage",
      value: 2,
      enabled: true,
    }
    updateRiskManagement({
      stopLoss: [{ ...stopLoss, ...updates }],
    })
  }

  const updateTakeProfit = (updates: any) => {
    const takeProfit = strategy.riskManagement.takeProfit[0] || {
      id: "tp-default",
      type: "percentage",
      value: 5,
      enabled: true,
    }
    updateRiskManagement({
      takeProfit: [{ ...takeProfit, ...updates }],
    })
  }

  const updatePositionSizing = (updates: any) => {
    const positionSizing = strategy.riskManagement.positionSizing[0] || {
      id: "ps-default",
      type: "percentage",
      value: 2,
      enabled: true,
    }
    updateRiskManagement({
      positionSizing: [{ ...positionSizing, ...updates }],
    })
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => 
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const stopLoss = strategy.riskManagement.stopLoss[0] || { type: "percentage", value: 2, enabled: true }
  const takeProfit = strategy.riskManagement.takeProfit[0] || { type: "percentage", value: 5, enabled: true }
  const positionSizing = strategy.riskManagement.positionSizing[0] || { type: "percentage", value: 2, enabled: true }

  return (
    <div className="space-y-4">
      {/* Risk Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-medium text-purple-300">Risk Management</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Configure how your strategy manages risk, position sizing, and trade exits to protect your capital.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-background/60 backdrop-blur-xl border border-purple-500/20 h-12">
            <TabsTrigger
              value="position"
              className="text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Position
            </TabsTrigger>
            <TabsTrigger
              value="exits"
              className="text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Exits
            </TabsTrigger>
            <TabsTrigger
              value="limits"
              className="text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Settings className="h-3 w-3 mr-1" />
              Limits
            </TabsTrigger>
          </TabsList>

          {/* Position Sizing Tab */}
          <TabsContent value="position" className="space-y-4 mt-4">
            <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4 text-purple-400" />
                  <span>Position Sizing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Position Sizing Type */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Sizing Method</Label>
                  <Select value={positionSizing.type} onValueChange={(value) => updatePositionSizing({ type: value })}>
                    <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                      <SelectItem value="percentage">Percentage of Portfolio</SelectItem>
                      <SelectItem value="fixed-amount">Fixed Dollar Amount</SelectItem>
                      <SelectItem value="risk-based">Risk-Based Sizing</SelectItem>
                      <SelectItem value="kelly">Kelly Criterion</SelectItem>
                      <SelectItem value="volatility-based">Volatility-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Position Size Value */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                      {positionSizing.type === "percentage"
                        ? "Portfolio %"
                        : positionSizing.type === "fixed-amount"
                          ? "Amount ($)"
                          : positionSizing.type === "risk-based"
                            ? "Risk %"
                            : positionSizing.type === "kelly"
                              ? "Kelly %"
                              : "Volatility Multiplier"}
                    </Label>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {positionSizing.value}
                      {["percentage", "risk-based", "kelly"].includes(positionSizing.type) ? "%" : ""}
                    </Badge>
                  </div>
                  <Slider
                    value={[Number(positionSizing.value)]}
                    onValueChange={(values) => updatePositionSizing({ value: values[0] })}
                    max={positionSizing.type === "fixed-amount" ? 10000 : 20}
                    min={positionSizing.type === "fixed-amount" ? 100 : 0.1}
                    step={positionSizing.type === "fixed-amount" ? 100 : 0.1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={positionSizing.value}
                    onChange={(e) => updatePositionSizing({ value: Number(e.target.value) })}
                    className="bg-background/80 border-purple-500/20 text-sm"
                  />
                </div>

                {/* Enable/Disable */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-purple-500/20">
                  <div>
                    <Label className="text-xs font-medium">Enable Position Sizing</Label>
                    <p className="text-xs text-muted-foreground">Use automatic position sizing</p>
                  </div>
                  <Switch
                    checked={positionSizing.enabled}
                    onCheckedChange={(checked) => updatePositionSizing({ enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exit Rules Tab */}
          <TabsContent value="exits" className="space-y-4 mt-4">
            {/* Stop Loss */}
            <Collapsible open={expandedSections.includes("stop-loss")} onOpenChange={() => toggleSection("stop-loss")}>
              <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <CardTitle className="text-sm">Stop Loss</CardTitle>
                        <Badge variant="outline" className="border-red-500/30 text-red-300 text-xs">
                          {stopLoss.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <motion.div animate={{ rotate: expandedSections.includes("stop-loss") ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Stop Loss Type</Label>
                      <Select value={stopLoss.type} onValueChange={(value) => updateStopLoss({ type: value })}>
                        <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="atr">ATR-based</SelectItem>
                          <SelectItem value="fixed-dollar">Fixed Dollar</SelectItem>
                          <SelectItem value="time">Time-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">
                          {stopLoss.type === "percentage" ? "Stop Loss %" : 
                           stopLoss.type === "atr" ? "ATR Multiplier" :
                           stopLoss.type === "fixed-dollar" ? "Amount ($)" : "Time (bars)"}
                        </Label>
                        <Badge variant="outline" className="border-red-500/30 text-red-300 text-xs">
                          {stopLoss.value}
                          {stopLoss.type === "percentage" ? "%" : 
                           stopLoss.type === "atr" ? "x" :
                           stopLoss.type === "fixed-dollar" ? "$" : ""}
                        </Badge>
                      </div>
                      <Slider
                        value={[Number(stopLoss.value)]}
                        onValueChange={(values) => updateStopLoss({ value: values[0] })}
                        max={stopLoss.type === "percentage" ? 10 : stopLoss.type === "atr" ? 5 : 1000}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        value={stopLoss.value}
                        onChange={(e) => updateStopLoss({ value: Number(e.target.value) })}
                        className="bg-background/80 border-purple-500/20 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-purple-500/20">
                      <div>
                        <Label className="text-xs font-medium">Enable Stop Loss</Label>
                        <p className="text-xs text-muted-foreground">Automatically exit losing trades</p>
                      </div>
                      <Switch
                        checked={stopLoss.enabled}
                        onCheckedChange={(checked) => updateStopLoss({ enabled: checked })}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Take Profit */}
            <Collapsible open={expandedSections.includes("take-profit")} onOpenChange={() => toggleSection("take-profit")}>
              <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <CardTitle className="text-sm">Take Profit</CardTitle>
                        <Badge variant="outline" className="border-green-500/30 text-green-300 text-xs">
                          {takeProfit.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <motion.div animate={{ rotate: expandedSections.includes("take-profit") ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Take Profit Type</Label>
                      <Select value={takeProfit.type} onValueChange={(value) => updateTakeProfit({ type: value })}>
                        <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="r:r">Risk:Reward Ratio</SelectItem>
                          <SelectItem value="atr">ATR-based</SelectItem>
                          <SelectItem value="trailing">Trailing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">
                          {takeProfit.type === "percentage" ? "Take Profit %" : 
                           takeProfit.type === "r:r" ? "Risk:Reward Ratio" :
                           takeProfit.type === "atr" ? "ATR Multiplier" : "Trailing %"}
                        </Label>
                        <Badge variant="outline" className="border-green-500/30 text-green-300 text-xs">
                          {takeProfit.value}
                          {takeProfit.type === "percentage" ? "%" : 
                           takeProfit.type === "r:r" ? ":1" :
                           takeProfit.type === "atr" ? "x" : "%"}
                        </Badge>
                      </div>
                      <Slider
                        value={[Number(takeProfit.value)]}
                        onValueChange={(values) => updateTakeProfit({ value: values[0] })}
                        max={takeProfit.type === "percentage" ? 50 : takeProfit.type === "r:r" ? 10 : 10}
                        min={0.1}
                        step={0.1}
                        className="w-full"
                      />
                      <Input
                        type="number"
                        value={takeProfit.value}
                        onChange={(e) => updateTakeProfit({ value: Number(e.target.value) })}
                        className="bg-background/80 border-purple-500/20 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-purple-500/20">
                      <div>
                        <Label className="text-xs font-medium">Enable Take Profit</Label>
                        <p className="text-xs text-muted-foreground">Automatically exit profitable trades</p>
                      </div>
                      <Switch
                        checked={takeProfit.enabled}
                        onCheckedChange={(checked) => updateTakeProfit({ enabled: checked })}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>

          {/* Limits Tab */}
          <TabsContent value="limits" className="space-y-4 mt-4">
            {/* Trading Limits */}
            <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  <span>Trading Limits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Max Open Positions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Max Open Positions</Label>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {strategy.riskManagement.maxOpenPositions}
                    </Badge>
                  </div>
                  <Slider
                    value={[strategy.riskManagement.maxOpenPositions]}
                    onValueChange={(values) => updateRiskManagement({ maxOpenPositions: values[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={strategy.riskManagement.maxOpenPositions}
                    onChange={(e) => updateRiskManagement({ maxOpenPositions: Number(e.target.value) })}
                    className="bg-background/80 border-purple-500/20 text-sm"
                  />
                </div>

                {/* Max Drawdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Max Drawdown (%)</Label>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {strategy.riskManagement.maxDrawdown}%
                    </Badge>
                  </div>
                  <Slider
                    value={[strategy.riskManagement.maxDrawdown]}
                    onValueChange={(values) => updateRiskManagement({ maxDrawdown: values[0] })}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={strategy.riskManagement.maxDrawdown}
                    onChange={(e) => updateRiskManagement({ maxDrawdown: Number(e.target.value) })}
                    className="bg-background/80 border-purple-500/20 text-sm"
                  />
                </div>

                {/* Max Daily Loss */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Max Daily Loss (%)</Label>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {strategy.riskManagement.maxDailyLoss}%
                    </Badge>
                  </div>
                  <Slider
                    value={[strategy.riskManagement.maxDailyLoss]}
                    onValueChange={(values) => updateRiskManagement({ maxDailyLoss: values[0] })}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={strategy.riskManagement.maxDailyLoss}
                    onChange={(e) => updateRiskManagement({ maxDailyLoss: Number(e.target.value) })}
                    className="bg-background/80 border-purple-500/20 text-sm"
                  />
                </div>

                {/* Max Consecutive Losses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Max Consecutive Losses</Label>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {strategy.riskManagement.maxConsecutiveLosses}
                    </Badge>
                  </div>
                  <Slider
                    value={[strategy.riskManagement.maxConsecutiveLosses]}
                    onValueChange={(values) => updateRiskManagement({ maxConsecutiveLosses: values[0] })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={strategy.riskManagement.maxConsecutiveLosses}
                    onChange={(e) => updateRiskManagement({ maxConsecutiveLosses: Number(e.target.value) })}
                    className="bg-background/80 border-purple-500/20 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span>Advanced Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profit Target */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Profit Target (%)</Label>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {strategy.riskManagement.profitTarget}%
                    </Badge>
                  </div>
                  <Slider
                    value={[strategy.riskManagement.profitTarget]}
                    onValueChange={(values) => updateRiskManagement({ profitTarget: values[0] })}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={strategy.riskManagement.profitTarget}
                    onChange={(e) => updateRiskManagement({ profitTarget: Number(e.target.value) })}
                    className="bg-background/80 border-purple-500/20 text-sm"
                  />
                </div>

                {/* Risk:Reward Minimum */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Min Risk:Reward Ratio</Label>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                      {strategy.riskManagement.riskRewardMinimum}:1
                    </Badge>
                  </div>
                  <Slider
                    value={[strategy.riskManagement.riskRewardMinimum]}
                    onValueChange={(values) => updateRiskManagement({ riskRewardMinimum: values[0] })}
                    max={5}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={strategy.riskManagement.riskRewardMinimum}
                    onChange={(e) => updateRiskManagement({ riskRewardMinimum: Number(e.target.value) })}
                    className="bg-background/80 border-purple-500/20 text-sm"
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Experience Level</Label>
                  <Select 
                    value={strategy.riskManagement.experienceLevel} 
                    onValueChange={(value) => updateRiskManagement({ experienceLevel: value })}
                  >
                    <SelectTrigger className="bg-background/80 border-purple-500/20 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-500/20">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Risk Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-purple-300 flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Risk Summary</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position Size:</span>
                    <span className="text-foreground">{positionSizing.value}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <span className="text-red-400">{stopLoss.value}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Take Profit:</span>
                    <span className="text-green-400">{takeProfit.value}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Positions:</span>
                    <span className="text-foreground">{strategy.riskManagement.maxOpenPositions}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
