"use client"

import { motion } from "framer-motion"
import { Settings, Eye, Shield, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { StrategyConfig } from "../../strategy-builder/strategy-builder"

interface MobileStrategyDetailsProps {
  strategy: StrategyConfig
  onChange: (strategy: Partial<StrategyConfig>) => void
}

export default function MobileStrategyDetails({ strategy, onChange }: MobileStrategyDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Strategy Name */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Settings className="h-4 w-4 text-purple-400" />
              <span>Strategy Name</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="strategy-name" className="text-sm font-medium">
              Give your strategy a memorable name
            </Label>
            <Input
              id="strategy-name"
              value={strategy.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g., RSI Momentum Strategy"
              className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors text-base"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Strategy Description */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Eye className="h-4 w-4 text-purple-400" />
              <span>Description</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="strategy-description" className="text-sm font-medium">
              Describe how your strategy works
            </Label>
            <Textarea
              id="strategy-description"
              value={strategy.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Explain your trading logic, indicators used, and market conditions..."
              className="bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-colors min-h-[100px] text-base resize-none"
              rows={4}
            />
            <div className="text-xs text-muted-foreground text-right">{strategy.description.length}/500 characters</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base">
              <Shield className="h-4 w-4 text-purple-400" />
              <span>Privacy Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/40 border border-purple-500/20">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <Label htmlFor="public-strategy" className="text-sm font-medium">
                    Make Strategy Public
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Public strategies appear in the marketplace for other users to discover and use
                </p>
              </div>
              <Switch
                id="public-strategy"
                checked={strategy.isPublic || false}
                onCheckedChange={(checked) => onChange({ isPublic: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-purple-300 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Quick Tips</span>
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="h-1 w-1 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Use descriptive names that explain your strategy's core logic</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1 w-1 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Include key indicators and timeframes in your description</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1 w-1 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Public strategies can earn you recognition in the community</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
