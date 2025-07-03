"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStrategy } from "@/context/strategy-context"

export default function BacktestClientPage() {
  const searchParams = useSearchParams()
  const [strategyName, setStrategyName] = useState<string>("")

  useEffect(() => {
    // Get strategy name from URL parameters
    const strategy = searchParams.get("strategy")
    if (strategy) {
      setStrategyName(strategy)
    }
  }, [searchParams])

  const { indicators } = useStrategy()

  const renderOptimizationCards = () => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {indicators.includes("sma") && (
          <>
            <div className="space-y-2">
              <Label>Moving Average Fast Period</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="5" />
                <Input type="number" placeholder="Max" defaultValue="50" />
                <Input type="number" placeholder="Step" defaultValue="5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Moving Average Slow Period</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="20" />
                <Input type="number" placeholder="Max" defaultValue="200" />
                <Input type="number" placeholder="Step" defaultValue="20" />
              </div>
            </div>
          </>
        )}

        {indicators.includes("rsi") && (
          <>
            <div className="space-y-2">
              <Label>RSI Period</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="7" />
                <Input type="number" placeholder="Max" defaultValue="21" />
                <Input type="number" placeholder="Step" defaultValue="2" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>RSI Overbought Level</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="65" />
                <Input type="number" placeholder="Max" defaultValue="85" />
                <Input type="number" placeholder="Step" defaultValue="5" />
              </div>
            </div>
          </>
        )}

        {indicators.includes("bollinger") && (
          <>
            <div className="space-y-2">
              <Label>Bollinger Period</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="10" />
                <Input type="number" placeholder="Max" defaultValue="30" />
                <Input type="number" placeholder="Step" defaultValue="5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bollinger Standard Deviation</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="1.5" />
                <Input type="number" placeholder="Max" defaultValue="3" />
                <Input type="number" placeholder="Step" defaultValue="0.5" />
              </div>
            </div>
          </>
        )}

        {indicators.includes("macd") && (
          <>
            <div className="space-y-2">
              <Label>MACD Fast Period</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="8" />
                <Input type="number" placeholder="Max" defaultValue="16" />
                <Input type="number" placeholder="Step" defaultValue="2" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>MACD Slow Period</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="Min" defaultValue="20" />
                <Input type="number" placeholder="Max" defaultValue="32" />
                <Input type="number" placeholder="Step" defaultValue="4" />
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Backtest: {strategyName}</h1>
        <p className="text-muted-foreground">Test your trading strategies against historical data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Settings</CardTitle>
              <CardDescription>Configure your backtest parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Strategy</label>
                  <Select defaultValue="ma-crossover">
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ma-crossover">Moving Average Crossover</SelectItem>
                      <SelectItem value="rsi-oscillator">RSI Oscillator</SelectItem>
                      <SelectItem value="bollinger-breakout">Bollinger Band Breakout</SelectItem>
                      <SelectItem value="custom">My Custom Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Symbol</label>
                  <Select defaultValue="BTCUSD">
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                      <SelectItem value="ETHUSD">ETH/USD</SelectItem>
                      <SelectItem value="AAPL">AAPL</SelectItem>
                      <SelectItem value="MSFT">MSFT</SelectItem>
                      <SelectItem value="AMZN">AMZN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Timeframe</label>
                  <Select defaultValue="1d">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" defaultValue="2023-01-01" />
                    <Input type="date" defaultValue="2023-12-31" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Capital</label>
                  <Input type="number" defaultValue="10000" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Position Size (%)</label>
                  <Input type="number" defaultValue="10" />
                </div>

                <Button className="w-full">Run Backtest</Button> 
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
              <CardDescription>Performance metrics and trade analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="performance">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="trades">Trades</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                </TabsList>
                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">+$2,450.75</div>
                        <p className="text-xs text-muted-foreground">+24.51%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">-$1,230.40</div>
                        <p className="text-xs text-muted-foreground">-12.30%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">68.5%</div>
                        <p className="text-xs text-muted-foreground">37 of 54 trades</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2.35</div>
                        <p className="text-xs text-muted-foreground">Gains / Losses</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1.85</div>
                        <p className="text-xs text-muted-foreground">Risk-adjusted return</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Trade</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">+$45.38</div>
                        <p className="text-xs text-muted-foreground">+0.45%</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="trades">
                  <div className="rounded-md border mt-4">
                    <div className="w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Entry</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Exit</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">P/L</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">2023-01-05</td>
                            <td className="p-4 align-middle text-green-600">Long</td>
                            <td className="p-4 align-middle">$105.25</td>
                            <td className="p-4 align-middle">$112.40</td>
                            <td className="p-4 align-middle text-green-600">+$715.00</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">2023-01-12</td>
                            <td className="p-4 align-middle text-red-600">Short</td>
                            <td className="p-4 align-middle">$115.80</td>
                            <td className="p-4 align-middle">$110.25</td>
                            <td className="p-4 align-middle text-green-600">+$555.00</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">2023-01-20</td>
                            <td className="p-4 align-middle text-green-600">Long</td>
                            <td className="p-4 align-middle">$97.30</td>
                            <td className="p-4 align-middle">$109.75</td>
                            <td className="p-4 align-middle text-green-600">+$1,245.00</td>
                          </tr>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">2023-01-29</td>
                            <td className="p-4 align-middle text-red-600">Short</td>
                            <td className="p-4 align-middle">$115.40</td>
                            <td className="p-4 align-middle">$118.75</td>
                            <td className="p-4 align-middle text-red-600">-$335.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="chart">
                  <div className="h-[400px] w-full mt-4 bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Equity curve chart would appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization</CardTitle>
              <CardDescription>Find the best parameters for your strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Parameter Optimization</h3>
                {renderOptimizationCards()}
              {/*  <Button>Run Optimization</Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
