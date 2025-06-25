import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BarChart4, Search, Filter, Star, TrendingUp, Shield, Zap, Sparkles, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Strategy Marketplace",
  description: "Explore and purchase trading strategies from the marketplace",
}

export default function StrategyMarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-purple-50/50 dark:bg-purple-950/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Strategy Marketplace
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Discover, customize, and deploy professional trading strategies. Build your own or choose from our
                curated collection.
              </p>
            </div>
            <div className="flex w-full max-w-2xl items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search strategies..."
                  className="h-12 pl-10 text-lg border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              <Button size="lg" className="h-12 px-6 bg-purple-600 hover:bg-purple-700">
                Search
              </Button>
            </div>
          </div>
          {/* Upload Strategy button - top right */}
          <div className="absolute right-6 top-6 z-10">
            <Link href="/strategy/upload">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Upload Strategy
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Strategies</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Rated</p>
                  <p className="text-2xl font-bold">4.8/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Creators</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">5,678</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-72">
            <Card className="sticky top-4 border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900/50"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trend Following
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900/50"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Momentum
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-purple-100 dark:hover:bg-purple-900/50"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Risk Management
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Strategy Grid */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Featured Strategies</h2>
                <p className="text-muted-foreground">Handpicked strategies for optimal performance</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/20"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Premium Moving Average Crossover",
                  slug: "premium-ma-crossover",
                  badge: "Premium",
                  description: "A refined trend-following strategy",
                  longDescription: "Advanced trend-following strategy with enhanced risk management.",
                  rating: 4.9,
                  reviews: 128,
                },
                {
                  title: "RSI Momentum Strategy",
                  slug: "rsi-momentum",
                  badge: "Popular",
                  description: "Advanced momentum detection",
                  longDescription: "Sophisticated RSI-based strategy for momentum trading.",
                  rating: 4.8,
                  reviews: 95,
                },
                {
                  title: "MACD Divergence Strategy",
                  slug: "macd-divergence",
                  badge: "New",
                  description: "Professional trend reversal detection",
                  longDescription: "Advanced MACD divergence strategy for market reversals.",
                  rating: 4.7,
                  reviews: 64,
                },
              ].map((strategy) => (
                <div key={strategy.slug} className="group relative">
                  <Card className="h-full cursor-pointer overflow-hidden border-purple-200/50 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg leading-tight">{strategy.title}</CardTitle>
                          </div>
                          <CardDescription className="text-sm">{strategy.description}</CardDescription>
                        </div>
                        {strategy.badge && (
                          <Badge
                            variant="secondary"
                            className={`ml-2 ${
                              strategy.badge === "Premium"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                : strategy.badge === "Popular"
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                  : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                            }`}
                          >
                            {strategy.badge}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="py-4">
                      <div className="flex items-center justify-center py-4 mb-4">
                        <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-4 group-hover:scale-110 transition-transform duration-300">
                          <BarChart4 className="h-12 w-12 text-purple-600" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{strategy.longDescription}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.round(strategy.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">
                              {strategy.rating} ({strategy.reviews})
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {/* Hover overlay with View Strategy button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-6">
                      <Link href={`/strategy/${strategy.slug}`} className="w-full">
                        <Button className="w-full bg-white text-purple-900 hover:bg-purple-50 font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Eye className="mr-2 h-4 w-4" />
                          View Strategy
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium CTA Section */}
      <div className="relative overflow-hidden bg-purple-50/50 dark:bg-purple-950/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/50 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Premium Feature</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Create Your Own Strategy
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Don't see what you're looking for? Use our powerful strategy builder to create your own custom trading
              strategy.
            </p>
            <Button size="lg" asChild className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Link href="/builder">
                Start Building <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
