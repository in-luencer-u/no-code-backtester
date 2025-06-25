"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Star,
  Shield,
  Zap,
  TrendingUp,
  BarChart4,
  Sparkles,
  CheckCircle,
  Play,
  Download,
  Share2,
  Heart,
  ChevronRight,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
}

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
}

const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
}

export default function StrategyProductClient({ params, staticProduct, previewData }: StrategyProductClientProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  // Mock gallery images for demonstration
  const galleryImages = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  useEffect(() => {
    setMounted(true)
    setIsVisible(true)
    async function fetchStrategies() {
      try {
        const uploaded: Strategy[] = []
        setStrategies([{ ...staticProduct, slug: params.slug }, ...uploaded])
      } catch (error) {
        console.error("Error fetching strategies:", error)
      }
    }
    fetchStrategies()
  }, [params.slug, staticProduct])

  const product = previewData || strategies.find((s) => s.slug === params.slug) || staticProduct

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    TrendingUp,
    Shield,
    Zap,
    Star,
  }

  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case "Premium":
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/25"
      case "Popular":
        return "bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
      default:
        return "bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
    }
  }

  return (
    <div className={`min-h-screen hero-bg ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Hero Section with Media Gallery */}
      <div className="relative text-white">
        <div className="container relative mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Enhanced Breadcrumb */}
          <motion.nav
            className="flex items-center space-x-2 text-sm text-purple-200 mb-8"
            variants={fadeInUp}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
          >
            <Link
              href="/marketplace"
              className="hover:text-white transition-colors duration-300 flex items-center space-x-1 group"
            >
              <span>Marketplace</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="text-purple-400">/</span>
            <span className="text-white font-medium">{product.title}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Enhanced Media Gallery */}
            <motion.div
              className="order-1"
              variants={slideInLeft}
              initial="initial"
              animate={isVisible ? "animate" : "initial"}
            >
              <div className="space-y-6">
                <motion.div
                  className="relative aspect-video rounded-2xl overflow-hidden bg-background/60 backdrop-blur-xl border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                  <img
                    src={galleryImages[selectedImage] || "/placeholder.svg"}
                    alt="Strategy visualization"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Enhanced Demo Button */}
                  <motion.div
                    className="absolute top-4 right-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="bg-white/10 text-white hover:bg-white/20 font-semibold border border-white/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </motion.div>

                  {/* Floating Stats Overlay */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-white">{product.stats[0]?.value}</div>
                          <div className="text-xs text-purple-300">Win Rate</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{product.stats[1]?.value}</div>
                          <div className="text-xs text-purple-300">Profit</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{product.stats[2]?.value || "54"}</div>
                          <div className="text-xs text-purple-300">Trades</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Enhanced Thumbnail Gallery */}
                <motion.div
                  className="flex gap-3 justify-center"
                  variants={staggerContainer}
                  initial="initial"
                  animate={isVisible ? "animate" : "initial"}
                >
                  {galleryImages.map((img, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === idx
                          ? "border-purple-400 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/25"
                          : "border-purple-500/30 hover:border-purple-400/60"
                      }`}
                      variants={fadeInScale}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Strategy Header */}
            <motion.div
              className="order-2"
              variants={slideInRight}
              initial="initial"
              animate={isVisible ? "animate" : "initial"}
            >
              <div className="flex items-start gap-6 mb-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="w-20 h-20 bg-background/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                    <BarChart4 className="w-10 h-10 text-purple-400" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Badge
                      variant="secondary"
                      className={`text-xs font-bold ${getBadgeStyles(product.badge)} border-0`}
                    >
                      {product.badge}
                    </Badge>
                  </motion.div>
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.title}
                  </motion.h1>
                  <motion.p
                    className="text-xl text-purple-200 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {product.description}
                  </motion.p>
                </div>
              </div>

              <motion.p
                className="text-purple-100 text-lg leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {product.longDescription}
              </motion.p>

              {/* Enhanced Rating Section */}
              <motion.div
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-purple-400"
                        }`}
                      />
                    </motion.div>
                  ))}
                  <span className="ml-2 text-purple-200 font-medium">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </motion.div>

              {/* Enhanced Action Buttons */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-400 text-red-400" : ""}`} />
                    Save
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </motion.div>
              </motion.div>

              {/* Enhanced Quick Stats */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={staggerContainer}
                initial="initial"
                animate={isVisible ? "animate" : "initial"}
              >
                {[
                  { label: "Win Rate", value: product.stats[0]?.value, icon: Target },
                  { label: "Max Drawdown", value: product.stats[1]?.value, icon: Shield },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-background/60 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                    variants={fadeInScale}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-purple-300">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content Area */}
      <div className="relative">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Enhanced Main Content */}
            <main className="lg:col-span-2 space-y-8">
              {/* Enhanced Performance Metrics */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="border border-purple-500/30 bg-background/60 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-300">
                      <motion.div
                        className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                      </motion.div>
                      <span className="text-xl font-semibold">Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {product.stats.map((stat, idx) => (
                        <motion.div
                          key={idx}
                          className="bg-background/40 border border-purple-500/20 rounded-xl p-4 text-center group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                          variants={fadeInScale}
                          whileHover={{ scale: 1.05, y: -5 }}
                        >
                          <motion.div
                            className="mb-3"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {iconMap[stat.icon]
                              ? React.createElement(iconMap[stat.icon], {
                                  className: "w-8 h-8 text-purple-400 mx-auto",
                                })
                              : null}
                          </motion.div>
                          <div className="text-2xl font-bold text-white drop-shadow-lg">{stat.value}</div>
                          <div className="text-sm text-purple-400">{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Key Features */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
              >
                <Card className="border border-purple-500/30 bg-background/60 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-300">
                      <motion.div
                        className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Sparkles className="h-5 w-5 text-purple-400" />
                      </motion.div>
                      <span className="text-xl font-semibold">Key Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="grid md:grid-cols-2 gap-4"
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {product.features?.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3 p-4 bg-background/30 border border-purple-500/20 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                          variants={fadeInScale}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }}>
                            <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          </motion.div>
                          <span className="text-sm text-white drop-shadow-lg group-hover:text-purple-100 transition-colors">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced User Reviews */}
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
              >
                {product.userReviews?.map((review, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <Card className="border border-purple-500/30 bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Avatar className="h-12 w-12 ring-2 ring-purple-500/30 hover:ring-purple-400/50 transition-all">
                              <AvatarImage src={review.image || "/placeholder.svg"} alt={review.name} />
                              <AvatarFallback className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {review.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div>
                            <CardTitle className="text-base text-purple-200">{review.name}</CardTitle>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-purple-500/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white italic leading-relaxed">"{review.comment}"</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced FAQ */}
              <motion.div
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
              >
                {product.faqs?.map((faq, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <Card className="border border-purple-500/30 bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 group">
                      <CardHeader>
                        <CardTitle className="text-base text-purple-300 group-hover:text-purple-200 transition-colors">
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </main>

            {/* Enhanced Sidebar */}
            <aside className="lg:col-span-1 space-y-6 sticky top-24 h-fit">
              {/* Enhanced Purchase Card */}
              <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card className="border border-purple-500/30 bg-background/60 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                  <CardHeader className="text-center">
                    <motion.div
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {product.price}
                    </motion.div>
                    <CardTitle className="text-xl text-purple-200">Purchase Strategy</CardTitle>
                    <CardDescription className="text-purple-400">
                      Get lifetime access to this strategy and all future updates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="lg"
                        className="w-full font-bold text-lg btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Purchase for {product.price}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                     { /* <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Sample
                      </Button> */  }
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-center text-xs text-purple-300 bg-background/40 backdrop-blur p-3 rounded-lg border border-purple-500/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      <span>30-Day Money-Back Guarantee</span>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Creator Info */}
              {product.owner && (
                <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                  <Card className="border border-purple-500/30 bg-background/60 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                    <CardHeader className="text-center">
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                        <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-purple-500/30 hover:ring-purple-400/50 transition-all">
                          <AvatarImage src={product.owner.image || "/placeholder.svg"} alt={product.owner.name} />
                          <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xl border border-purple-500/30">
                            {product.owner.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <CardTitle className="text-purple-200">{product.owner.name}</CardTitle>
                      <CardDescription className="font-medium text-purple-400">{product.owner.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-white mb-4 leading-relaxed">{product.owner.bio}</p>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300"
                        >
                          Contact Creator
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Enhanced Trust Indicators */}
              <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
                <Card className="border border-purple-500/30 bg-background/60 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                  <CardContent className="p-6">
                    <motion.div
                      className="space-y-4"
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {[
                        { icon: Shield, text: "Verified Strategy", color: "text-green-400" },
                        { icon: CheckCircle, text: "Backtested Results", color: "text-green-400" },
                        { icon: Star, text: "Top Rated Creator", color: "text-yellow-400" },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3 group"
                          variants={fadeInScale}
                          whileHover={{ x: 5 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                          </motion.div>
                          <span className="text-sm text-white group-hover:text-purple-200 transition-colors">
                            {item.text}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
