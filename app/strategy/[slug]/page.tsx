import Link from "next/link"
import { Button } from "@/components/ui/button"
import StrategyProductClient from "./StrategyProductClient"

// Dummy data for demonstration; replace with real data fetching logic
const STRATEGY_DATA = {
  "premium-ma-crossover": {
    title: "Premium Moving Average Crossover",
    badge: "Premium",
    description: "A refined trend-following strategy.",
    longDescription: "A refined trend-following strategy with advanced risk management, designed for traders looking for consistent performance across various market conditions. This strategy utilizes a dual moving average system to identify trends and includes a dynamic stop-loss mechanism.",
    rating: 4.9,
    reviews: 128,
    features: [
      "Advanced trend-following logic",
      "Dynamic risk management",
      "Optimized for multiple markets",
      "Easy integration with Trade Crafter platform"
    ],
    stats: [
      { icon: "TrendingUp", label: "Win Rate", value: "72%" },
      { icon: "Shield", label: "Max Drawdown", value: "4.2%" },
      { icon: "Zap", label: "Avg. Trades/Month", value: "18" },
      { icon: "Star", label: "User Rating", value: "4.9/5" }
    ],
    price: "$49.99",
    image: "/logo.png",
    owner: {
      name: "Alex Morgan",
      title: "Lead Quantitative Strategist",
      bio: "Alex is a seasoned trader with 10+ years of experience in algorithmic trading.",
      image: "/placeholder-user.jpg"
    },
    userReviews: [
      { name: "Priya S.", image: "/placeholder-user.jpg", rating: 5, comment: "This strategy changed my trading game. The risk management is top-notch." },
      { name: "Michael T.", image: "/placeholder-user.jpg", rating: 5, comment: "Easy to use and very effective. Highly recommend!" }
    ],
    faqs: [
      { question: "How do I install this strategy?", answer: "After purchase, you'll get a step-by-step guide for integration." },
      { question: "Is there a refund policy?", answer: "Yes, we offer a 30-day money-back guarantee." }
    ]
  },
  "rsi-momentum": {
    title: "RSI Momentum Strategy",
    badge: "Popular",
    description: "Sophisticated RSI-based strategy for momentum trading.",
    longDescription: "This strategy leverages the Relative Strength Index (RSI) to identify strong momentum plays. It's designed for active traders who want to capitalize on short to medium-term price movements. Includes customizable RSI parameters.",
    rating: 4.8,
    reviews: 95,
    features: [
      "Momentum detection using RSI",
      "Customizable parameters",
      "Backtested on multiple assets",
      "Real-time alerts"
    ],
    stats: [
      { icon: "TrendingUp", label: "Win Rate", value: "68%" },
      { icon: "Shield", label: "Max Drawdown", value: "5.1%" },
      { icon: "Zap", label: "Avg. Trades/Month", value: "22" },
      { icon: "Star", label: "User Rating", value: "4.8/5" }
    ],
    price: "$39.99",
    image: "/logo.png",
    owner: {
      name: "Jane Doe",
      title: "Momentum Trading Specialist",
      bio: "Jane specializes in momentum-based systems and has a track record of successful strategies.",
      image: "/placeholder-user.jpg"
    },
    userReviews: [
      { name: "Carlos R.", image: "/placeholder-user.jpg", rating: 5, comment: "Fantastic for catching big market moves. Very happy with it." },
      { name: "Emily B.", image: "/placeholder-user.jpg", rating: 4, comment: "Solid strategy, though it requires some monitoring." }
    ],
    faqs: [
      { question: "What assets does this work best on?", answer: "It's optimized for major forex pairs and large-cap stocks." },
      { question: "Can I automate this strategy?", answer: "Yes, it's fully compatible with the Trade Crafter automation tools." }
    ]
  },
  "macd-divergence": {
    title: "MACD Divergence Strategy",
    badge: "New",
    description: "Advanced MACD divergence strategy for market reversals.",
    longDescription: "Identify potential market reversals with high accuracy using MACD divergence. This strategy is perfect for swing traders looking to enter positions at the start of a new trend. Comes with detailed guides on identifying divergence.",
    rating: 4.7,
    reviews: 64,
    features: [
      "Professional trend reversal detection",
      "MACD-based entry/exit logic",
      "Risk management included",
      "Detailed documentation"
    ],
    stats: [
      { icon: "TrendingUp", label: "Win Rate", value: "65%" },
      { icon: "Shield", label: "Max Drawdown", value: "6.0%" },
      { icon: "Zap", label: "Avg. Trades/Month", value: "15" },
      { icon: "Star", label: "User Rating", value: "4.7/5" }
    ],
    price: "$29.99",
    image: "/logo.png",
    owner: {
      name: "Sam Johnson",
      title: "Technical Analysis Expert",
      bio: "Sam is a certified market technician known for his expertise in indicator-based strategies.",
      image: "/placeholder-user.jpg"
    },
    userReviews: [
      { name: "David L.", image: "/placeholder-user.jpg", rating: 5, comment: "The divergence signals are incredibly accurate. A must-have for any serious trader." },
      { name: "Sarah K.", image: "/placeholder-user.jpg", rating: 4, comment: "Great strategy for identifying reversals. The documentation is very helpful." }
    ],
    faqs: [
      { question: "How much capital do I need?", answer: "The strategy can be adapted for various account sizes, starting from $500." },
      { question: "Is this suitable for beginners?", answer: "It's best for those with some trading experience, but the guide is comprehensive." }
    ]
  }
}

// Next.js 15+ expects params to be a Promise<{ slug: string }>
// so we need to make the prop type: { params: Promise<{ slug: string }> }
// and await params

export default async function StrategyProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const staticProduct = STRATEGY_DATA[slug as keyof typeof STRATEGY_DATA]

  if (!staticProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Strategy Not Found</h1>
        <p className="text-muted-foreground mb-6">The strategy you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    )
  }

  return <StrategyProductClient params={{ slug }} staticProduct={staticProduct} />
}
