'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Star, Shield, Zap, TrendingUp, BarChart4, Sparkles, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Stat {
  icon: any
  label: string
  value: string
}

interface Strategy {
  title: string
  badge: string
  description: string
  longDescription: string
  rating: number
  reviews: number
  features: string[]
  stats: Stat[]
  price: string
  image: string
  slug?: string
  faqs?: Array<{ question: string; answer: string }>
  videos?: string[]
  owner?: {
    name: string
    title: string
    bio: string
    image: string
  }
  userReviews?: Array<{ name: string; image: string; rating: number; comment: string }>
}

interface StrategyProductClientProps {
  params: { slug: string }
  staticProduct: Strategy
  previewData?: Strategy
}

export default function StrategyProductClient({ params, staticProduct, previewData }: StrategyProductClientProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    async function fetchStrategies() {
      try {
        const uploaded: Strategy[] = []
        setStrategies([
          { ...staticProduct, slug: params.slug },
          ...uploaded,
        ])
      } catch (error) {
        console.error('Error fetching strategies:', error)
      }
    }
    fetchStrategies()
  }, [params.slug, staticProduct])

  const product = previewData || strategies.find(s => s.slug === params.slug) || staticProduct

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    TrendingUp,
    Shield,
    Zap,
    Star,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-2">
            {/* Strategy Header */}
            <section className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart4 className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    <Badge variant="secondary" className="text-sm">{product.badge}</Badge>
                  </div>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              </div>
              <p className="text-base text-muted-foreground">{product.longDescription}</p>
            </section>
            
            <Separator className="my-8" />
            
            {/* Performance Stats */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.stats.map((stat, idx) => (
                  <Card key={idx} className="bg-primary/5 border-primary/10">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      {iconMap[stat.icon] ? (
                        React.createElement(iconMap[stat.icon], { className: "w-8 h-8 text-primary mb-2" })
                      ) : null}
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            <Separator className="my-8" />

            {/* Features */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {product.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>
            
            <Separator className="my-8" />
            
            {/* User Reviews */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
              <div className="space-y-6">
                {product.userReviews?.map((review, idx) => (
                  <Card key={idx} className="bg-primary/5 border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.image} alt={review.name} />
                          <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{review.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            
            <Separator className="my-8" />

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {product.faqs?.map((faq, idx) => (
                  <Card key={idx} className="bg-primary/5 border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-base">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

          </main>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8 sticky top-24 h-fit">
            {/* Purchase Card */}
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl">Purchase Strategy</CardTitle>
                <CardDescription>Get lifetime access to this strategy and all future updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-4xl font-bold text-primary">{product.price}</p>
                <Button size="lg" className="w-full font-bold text-lg bg-gradient-to-r from-yellow-400 via-primary to-purple-400 text-zinc-900 shadow-lg hover:scale-105 transition-transform">
                  Purchase for {product.price}
                </Button>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Info className="w-4 h-4 mr-2" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Creator Info */}
            {product.owner && (
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-2">
                    <AvatarImage src={product.owner.image} alt={product.owner.name} />
                    <AvatarFallback>{product.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{product.owner.name}</CardTitle>
                  <CardDescription>{product.owner.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-center text-muted-foreground">{product.owner.bio}</p>
                  <Button variant="outline" className="w-full mt-4">Contact Creator</Button>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
