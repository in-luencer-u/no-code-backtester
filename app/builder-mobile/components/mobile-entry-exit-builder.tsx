"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Settings, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import MobileIndicatorBuilder from "./mobile-indicator-builder"
import type { StrategyConfig } from "@/components/strategy-builder/strategy-builder"

interface MobileEntryExitBuilderProps {
  strategy: StrategyConfig
  onChange: (strategy: Partial<StrategyConfig>) => void
}

export default function MobileEntryExitBuilder({ strategy, onChange }: MobileEntryExitBuilderProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["entry-long"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const sections = [
    {
      id: "entry-long",
      title: "Long Entry Rules",
      subtitle: "When to buy/go long",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      rule: strategy.entryLong,
      onChange: (rule: any) => onChange({ entryLong: rule }),
    },
    {
      id: "entry-short",
      title: "Short Entry Rules",
      subtitle: "When to sell/go short",
      icon: TrendingDown,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      rule: strategy.entryShort,
      onChange: (rule: any) => onChange({ entryShort: rule }),
    },
    {
      id: "exit-long",
      title: "Long Exit Rules",
      subtitle: "When to close long positions",
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      rule: strategy.exitLong,
      onChange: (rule: any) => onChange({ exitLong: rule }),
    },
    {
      id: "exit-short",
      title: "Short Exit Rules",
      subtitle: "When to close short positions",
      icon: TrendingDown,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      rule: strategy.exitShort,
      onChange: (rule: any) => onChange({ exitShort: rule }),
    },
  ]

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-medium text-purple-300">Entry & Exit Rules</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Define when your strategy should enter and exit trades. Tap each section to configure the conditions.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rule Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isExpanded = expandedSections.includes(section.id)
          const conditionCount = section.rule.conditionGroups.reduce(
            (total, group) => total + group.conditions.length,
            0,
          )

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
                <Card
                  className={`border-purple-500/20 bg-background/60 backdrop-blur-xl transition-all duration-300 ${
                    isExpanded ? "shadow-lg shadow-purple-500/10" : ""
                  }`}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-3 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${section.bgColor} border ${section.borderColor}`}>
                            <section.icon className={`h-4 w-4 ${section.color}`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-sm font-medium text-foreground">{section.title}</CardTitle>
                            <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {conditionCount > 0 && (
                            <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                              {conditionCount} rule{conditionCount !== 1 ? "s" : ""}
                            </Badge>
                          )}
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <MobileIndicatorBuilder
                        positionRule={section.rule}
                        onChange={section.onChange}
                        title={section.title}
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="border-purple-500/20 bg-background/60 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-purple-300">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10 text-xs bg-transparent"
                  onClick={() => {
                    // Expand all sections
                    setExpandedSections(sections.map((s) => s.id))
                  }}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10 text-xs bg-transparent"
                  onClick={() => {
                    // Collapse all sections
                    setExpandedSections([])
                  }}
                >
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Collapse All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
