"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  Heart,
  Lightbulb,
  Bug,
  Zap,
  Sparkles,
  ThumbsUp,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

type FeedbackType = "suggestion" | "bug" | "feature" | "general"
type FeedbackRating = 1 | 2 | 3 | 4 | 5

const feedbackTypes = [
  {
    id: "suggestion" as FeedbackType,
    label: "Suggestion",
    icon: Lightbulb,
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  {
    id: "bug" as FeedbackType,
    label: "Bug Report",
    icon: Bug,
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  {
    id: "feature" as FeedbackType,
    label: "Feature Request",
    icon: Zap,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "general" as FeedbackType,
    label: "General Feedback",
    icon: MessageSquare,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
]

export default function EnhancedFeedbackSection() {
  const [selectedType, setSelectedType] = useState<FeedbackType>("general")
  const [rating, setRating] = useState<FeedbackRating | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  const handleSubmit = async () => {
    if (!feedback.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Reset form after success animation
    setTimeout(() => {
      setIsSubmitted(false)
      setFeedback("")
      setRating(null)
      setSelectedType("general")
    }, 3000)
  }

  const selectedTypeData = feedbackTypes.find((type) => type.id === selectedType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="w-full"
    >
      <Card className="border-purple-500/20 hover:border-purple-500/30 transition-all duration-500 bg-background/60 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-50" />
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

        <CardHeader className="relative pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  We Value Your Feedback
                </CardTitle>
                <p className="text-muted-foreground mt-1">Help us improve your trading experience</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            >
              <Sparkles className="h-6 w-6 text-purple-400" />
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="feedback-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Feedback Type Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span>What type of feedback do you have?</span>
                  </Label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon
                      const isSelected = selectedType === type.id

                      return (
                        <motion.button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
                            isSelected
                              ? `${type.bgColor} ${type.borderColor} shadow-lg`
                              : "bg-background/40 border-border/50 hover:border-purple-500/30"
                          }`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`p-2 rounded-lg ${isSelected ? type.bgColor : "bg-purple-500/10"}`}>
                              <Icon
                                className={`h-5 w-5 ${isSelected ? `bg-gradient-to-r ${type.color} bg-clip-text text-transparent` : "text-purple-400"}`}
                              />
                            </div>
                            <span
                              className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {type.label}
                            </span>
                          </div>
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center space-x-2">
                    <Star className="h-4 w-4 text-purple-400" />
                    <span>How would you rate your experience?</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => setRating(star as FeedbackRating)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="p-1 rounded-lg hover:bg-purple-500/10 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          className={`h-8 w-8 transition-all duration-200 ${
                            star <= (hoveredStar || rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </motion.button>
                    ))}
                    {rating && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4">
                        <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                          {rating === 5
                            ? "Excellent!"
                            : rating === 4
                              ? "Great!"
                              : rating === 3
                                ? "Good"
                                : rating === 2
                                  ? "Fair"
                                  : "Poor"}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Feedback Text Area */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-purple-400" />
                    <span>Share your thoughts</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={`Your ${selectedTypeData?.label.toLowerCase()} helps us improve...`}
                      className="min-h-[120px] bg-background/80 border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/60 transition-all duration-300 resize-none text-base leading-relaxed"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">{feedback.length}/500</div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div className="flex justify-end" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={!feedback.trim() || isSubmitting}
                    className="btn-primary group h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-12 space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                  </div>
                </motion.div>

                <div className="space-y-2">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-green-400"
                  >
                    Thank You!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground text-lg"
                  >
                    Your feedback has been submitted successfully.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm text-muted-foreground"
                  >
                    We appreciate you taking the time to help us improve!
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex justify-center"
                >
                  <Badge variant="outline" className="border-green-500/30 text-green-400 px-4 py-2">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Feedback Received
                  </Badge>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
