"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import {
  ArrowRight,
  BarChart4,
  Bot,
  LineChartIcon as ChartLine,
  Clock,
  DollarSign,
  LineChart,
  Shield,
  TrendingUp,
  Users,
  User,
  Star,
  Zap,
  Target,
  Award,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
}

const fadeInScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
}

const slideInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
}

export default function Home() {

const router = useRouter()

  useEffect(()=>{
    router.replace("/builder-mobile")

  },[])
 




  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  



  

  useEffect(() => {
   // setIsVisible(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col md:mt-0 mt-12">
      {/* Enhanced Hero Section with Parallax */}
      <section className="relative overflow-hidden hero-bg py-16 md:py-24 lg:py-32">
        {/* Animated Background Elements with Parallax */}
        <motion.div className="absolute inset-0 overflow-hidden" style={{ y }}>
          <motion.div
            className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
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
            className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl"
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
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </motion.div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:gap-16 lg:grid-cols-2 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-6 lg:space-y-8"
              initial="initial"
              animate={isVisible ? "animate" : "initial"}
              variants={staggerContainer}
            >
              <motion.div className="space-y-4 lg:space-y-6" variants={staggerContainer}>
                <motion.div
                  className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  No-Code Trading Platform
                </motion.div>

                <motion.h1
                  className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  variants={fadeInUp}
                >
                  Build <span className="gradient-text">Trading Strategies</span> Without Code
                </motion.h1>

                <motion.p
                  className="max-w-lg text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed"
                  variants={fadeInUp}
                >
                  Create, backtest, and deploy professional trading strategies with our visual builder. No coding
                  required, just pure trading logic.
                </motion.p>
              </motion.div>

              <motion.div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0" variants={fadeInUp}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="btn-primary group" asChild>
                    <Link href="/signup">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4" variants={staggerContainer}>
                {[
                  { icon: Shield, text: "Bank-level Security" },
                  { icon: Clock, text: "Setup in Minutes" },
                  { icon: DollarSign, text: "Free to Start" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                  >
                    <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Enhanced Dashboard Preview with 3D Effect */}
            <motion.div
              className="relative"
              initial="initial"
              animate={isVisible ? "animate" : "initial"}
              variants={slideInRight}
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                whileHover={{
                  rotateY: 5,
                  rotateX: 5,
                  scale: 1.02,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="relative border-purple-500/30 bg-card/90 backdrop-blur-xl shadow-2xl glow-purple">
                  <CardContent className="p-6">
                    <motion.div
                      className="mb-6 flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="font-semibold text-lg">Strategy Performance</h3>
                      <div className="flex items-center space-x-2">
                        <motion.div
                          className="h-2 w-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                        <span className="text-sm text-muted-foreground">Live</span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="h-48 sm:h-64 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 p-6 mb-6 relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
                      <div className="relative flex h-full items-center justify-center">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <LineChart className="h-24 w-24 sm:h-32 sm:w-32 text-primary/60" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-3 gap-4"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {[
                        {
                          label: "Win Rate",
                          value: "68.5%",
                          color: "green",
                          bg: "from-green-500/10 to-green-600/5",
                          border: "border-green-500/20",
                        },
                        {
                          label: "Profit",
                          value: "+24.5%",
                          color: "primary",
                          bg: "from-primary/10 to-primary/5",
                          border: "border-primary/20",
                        },
                        {
                          label: "Trades",
                          value: "54",
                          color: "blue",
                          bg: "from-blue-500/10 to-blue-600/5",
                          border: "border-blue-500/20",
                        },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          className={`rounded-xl bg-gradient-to-br ${stat.bg} p-4 text-center border ${stat.border}`}
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                          <p
                            className={`text-lg font-bold ${stat.color === "green" ? "text-green-400" : stat.color === "blue" ? "text-blue-400" : "text-primary"}`}
                          >
                            {stat.value}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <InViewSection className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 lg:mb-16 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 mb-6"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <Target className="mr-2 h-4 w-4" />
              How It Works
            </motion.div>
            <motion.h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" variants={fadeInUp}>
              Build Strategies in <span className="gradient-text">3 Simple Steps</span>
            </motion.h2>
            <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp}>
              From idea to execution in minutes, not months
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: TrendingUp,
                title: "1. Build Your Strategy",
                description:
                  "Use our visual builder to create trading strategies with technical indicators, entry/exit rules, and risk management.",
                color: "from-purple-500/20 to-purple-600/10",
              },
              {
                icon: BarChart4,
                title: "2. Backtest & Optimize",
                description:
                  "Test your strategy against historical data to validate performance and optimize parameters for better results.",
                color: "from-primary/20 to-primary/10",
              },
              {
                icon: Bot,
                title: "3. Deploy & Automate",
                description:
                  "Deploy your strategy to receive trading signals or connect to exchanges for fully automated trading.",
                color: "from-green-500/20 to-green-600/10",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="group border-primary/10 hover:border-primary/20 transition-all duration-500 h-full">
                  <CardContent className="pt-8 pb-6">
                    <motion.div
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} border border-primary/10`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="mb-3 text-xl font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </InViewSection>

      {/* Enhanced Benefits Section */}
      <InViewSection className="section-dark py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 lg:mb-16 text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 mb-6"
              variants={fadeInUp}
            >
              <Award className="mr-2 h-4 w-4" />
              Why Choose TradeCraft
            </motion.div>
            <motion.h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" variants={fadeInUp}>
              The Complete <span className="gradient-text">Trading Solution</span>
            </motion.h2>
            <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeInUp}>
              Everything you need to succeed in trading, all in one platform
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: ChartLine,
                title: "No Coding Required",
                description:
                  "Build complex strategies with our intuitive visual interface, no programming skills needed.",
              },
              {
                icon: Shield,
                title: "Advanced Risk Management",
                description:
                  "Protect your capital with sophisticated risk management tools tailored to your risk tolerance.",
              },
              {
                icon: BarChart4,
                title: "Comprehensive Backtesting",
                description:
                  "Test your strategies against historical data with detailed performance metrics and analysis.",
              },
              {
                icon: Bot,
                title: "Automated Trading",
                description:
                  "Connect to popular exchanges and automate your trading strategies or receive custom alerts.",
              },
            ].map((benefit, index) => (
              <motion.div key={index} className="group text-center" variants={fadeInUp} whileHover={{ y: -5 }}>
                <motion.div
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 mx-auto group-hover:scale-110 transition-transform duration-300"
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    scale: 1.15,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <benefit.icon className="h-10 w-10 text-primary" />
                </motion.div>
                <h3 className="mb-3 text-lg font-bold group-hover:text-primary transition-colors">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </InViewSection>

      {/* Enhanced Founder Story Section */}
      <InViewSection className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              className="relative order-2 lg:order-1"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                <div className="flex h-full items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <User className="h-24 w-24 sm:h-32 sm:w-32 text-primary/60" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col justify-center space-y-6 order-1 lg:order-2"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div
                className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 w-fit"
                variants={fadeInUp}
              >
                <Users className="mr-2 h-4 w-4" />
                Founder Story
              </motion.div>

              <motion.h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" variants={fadeInUp}>
                From Losing Trader to <span className="gradient-text">Winning System</span>
              </motion.h2>

              <motion.div className="space-y-4 text-muted-foreground leading-relaxed" variants={staggerContainer}>
                <motion.p variants={fadeInUp}>
                  I was you—a beginner trader losing money with every random YouTube strategy I tried. I'd stare at
                  charts for hours, hoping for a breakthrough... but all I got was emotional burnout and a blown-up
                  account.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  <strong className="text-foreground">I knew there had to be a better way.</strong>
                </motion.p>
                <motion.p variants={fadeInUp}>
                  So I locked in. I studied the markets, mastered Pine Script, and built my own custom strategies. No
                  noise. No hype. Just data-backed logic. The results? I finally started winning consistently—and with
                  control.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  Now, I've turned that same system into a tool for traders like you—so you never have to trade blindly
                  again.
                </motion.p>
              </motion.div>

              <motion.div className="flex items-center space-x-4 pt-4" variants={fadeInUp}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div key={i} whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Anandhu</strong>, Founder & CEO
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </InViewSection>

      {/* Enhanced CTA Section */}
      <InViewSection className="section-dark py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 mb-8"
              variants={fadeInUp}
            >
              <Clock className="mr-2 h-4 w-4" />
              Limited Time Offer
            </motion.div>

            <motion.h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6" variants={fadeInUp}>
              Ready to Transform Your <span className="gradient-text">Trading Journey?</span>
            </motion.h2>

            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Join thousands of traders who have improved their results with TradeCraft's strategy builder and
              backtesting tools.
            </motion.p>

            <motion.div variants={fadeInScale} whileHover={{ scale: 1.02, y: -5 }}>
              <Card className="max-w-md mx-auto border-primary/20 bg-card/80 backdrop-blur-xl mb-8">
                <CardContent className="p-6">
                  <motion.div
                    className="mb-4 flex items-center justify-center space-x-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <motion.div
                      className="h-2 w-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span className="text-sm font-medium text-green-400">Active Promotion</span>
                  </motion.div>
                  <p className="mb-6 text-center font-medium">
                    Only <span className="text-primary font-bold">7 free strategy templates</span> left this month!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="btn-primary w-full group" asChild>
                        <Link href="/signup">
                          Start Building Free
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-primary/20 hover:bg-primary/5"
                        asChild
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.p className="text-sm text-muted-foreground" variants={fadeInUp}>
              No credit card required • Free plan available • Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </InViewSection>

      {/* Enhanced Footer */}
      <motion.footer
        className="border-t border-purple-500/20 bg-card/40 backdrop-blur-xl py-12 lg:py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="lg:col-span-1" variants={fadeInUp}>
              <h3 className="mb-4 text-lg font-bold gradient-text">TradeCraft</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The all-in-one platform for creating, testing, and deploying trading strategies without code.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 text-xs">
                  <motion.div
                    className="h-2 w-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <span className="text-muted-foreground">All systems operational</span>
                </div>
              </div>
            </motion.div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Testimonials", "FAQ"],
              },
              {
                title: "Resources",
                links: ["Blog", "Documentation", "Tutorials", "Support"],
              },
              {
                title: "Company",
                links: ["About", "Contact", "Privacy Policy", "Terms of Service"],
              },
            ].map((section, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <h4 className="mb-4 text-sm font-semibold">{section.title}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <Link href="#" className="hover:text-primary transition-colors">
                        {link}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>&copy; {new Date().getFullYear()} TradeCraft. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

// Helper component for in-view animations
function InViewSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {children}
    </motion.section>
  )
}
