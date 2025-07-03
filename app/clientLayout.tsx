"use client"

import type React from "react"
import { useEffect, useState } from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation"
import emailjs from "@emailjs/browser"
import { emailjsConfig } from "./config/emailjs"

import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/ui/mobile-nav"
import { 
  MessageSquare, 
  LayoutDashboard, 
  Store, 
  Settings, 
  LineChart, 
  Code, 
  ChevronLeft, 
  ChevronRight,
  Upload
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ModernNavbar from "@/components/ui/ModernNavbar"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

interface EmailJSResponse {
  status: number;
  text: string;
}

// Updated to send feedback using EmailJS directly
const sendFeedback = async (feedback: string) => {
  try {
    const { serviceId, templateId, publicKey, templateParams } = emailjsConfig;

    // Validate configuration
    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration is incomplete');
    }

    // Initialize EmailJS with error handling
    try {
      await emailjs.init(publicKey);
    } catch (initError) {
      console.error('Failed to initialize EmailJS:', initError);
      throw new Error('Failed to initialize email service');
    }

    const params = {
      ...templateParams,
      message: feedback,
      feedback: feedback,
      email: templateParams.email,
      reply_to: templateParams.reply_to
    };

    console.log('Attempting to send email with params:', params);

    // Send email with timeout
    const response = await Promise.race([
      emailjs.send(serviceId, templateId, params),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), 10000)
      )
    ]) as EmailJSResponse;

    console.log('EmailJS response:', response);

    if (response && response.status === 200) {
      console.log("Feedback sent successfully!", response);
      alert("Thank you for your feedback!");
    } else {
      throw new Error(`EmailJS returned unexpected response: ${JSON.stringify(response)}`);
    }
  } catch (error: unknown) {
    console.error("Failed to send feedback:", error);
    let errorMessage = "An unexpected error occurred. Please try again later.";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
    }
    
    alert(`Failed to send feedback: ${errorMessage}`);
  }
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  // Determine if the current route is an authenticated route
  useEffect(() => {
    const authenticatedRoutes = [
      "/dashboard",
      "/builder",
      "/backtest",
      "/marketplace",
      "/settings",
      "/survey",
      "/strategy-choice",
      "/backtest-satisfaction",
      "/profile",
      "/strategy/upload",
      "/strategy"
    ]

    const isAuthRoute = authenticatedRoutes.some((route) => pathname?.startsWith(route))
    const isAuthPage = pathname === "/login" || pathname === "/signup"

    setIsAuthenticated(isAuthRoute && !isAuthPage)
  }, [pathname])

  const navLinks = [
   {/* { href: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { href: "/marketplace", icon: Store, text: "Marketplace" },
    { href: "/builder", icon: Code, text: "Builder" },
    { href: "/backtest", icon: LineChart, text: "Backtest" },
    { href: "/settings", icon: Settings, text: "Settings" }, */}
  ]

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex">
        {/* Sidebar for authenticated users */}
        {isAuthenticated && (
          <aside className={cn(
            "hidden md:flex flex-col h-screen bg-background border-r border-primary/10 sticky top-0 z-40 transition-all duration-300",
            sidebarCollapsed ? "w-20" : "w-64"
          )}>
            <div className="flex items-center justify-center h-20 border-b border-primary/10">
              <Link href="/dashboard" className="flex items-center space-x-2">
                 <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="20" width="3" height="10" rx="1.5" fill="#2196F3"/>
                  <rect x="13" y="14" width="3" height="10" rx="1.5" fill="#2196F3"/>
                  <rect x="18" y="8" width="3" height="10" rx="1.5" fill="#2196F3"/>
                  <rect x="23" y="8" width="3" height="10" rx="1.5" fill="#F44336"/>
                  <rect x="28" y="14" width="3" height="10" rx="1.5" fill="#F44336"/>
                  <rect x="33" y="20" width="3" height="10" rx="1.5" fill="#F44336"/>
                </svg>
                {!sidebarCollapsed && <span className="font-bold text-lg">Trade Crafter</span>}
              </Link>
            </div>

            {/* Collapse/Expand button */}
            <button
              className="absolute -right-3 top-24 transform -translate-y-1/2 bg-background border border-primary/20 rounded-full p-1.5 shadow-md hover:bg-primary/10 transition-colors z-50"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Profile section */}
            <div className={cn(
              "flex flex-col items-center mt-8 transition-opacity duration-300",
              sidebarCollapsed ? "opacity-0 h-0" : "opacity-100 h-auto"
            )}>
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">Alex Morgan</span>
              <span className="text-xs text-muted-foreground">alex@example.com</span>
            </div>

            {/* Navigation links 
            <nav className="flex flex-col gap-2 mt-8 px-4">
              {navLinks?.map((link) => {
                const isActive = pathname?.startsWith(link?.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center h-12 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200 relative",
                      isActive && "bg-primary/10 text-primary font-semibold",
                      sidebarCollapsed ? "justify-center" : "px-4 gap-4"
                    )}
                  >
                    <link.icon className="h-6 w-6" />
                    {!sidebarCollapsed && <span>{link.text}</span>}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </nav>*/}

            <div className="mt-auto p-4">
              <Link href="/strategy/upload" className={cn(
                "flex items-center justify-center h-12 rounded-lg bg-gradient-to-r from-yellow-400 via-primary to-purple-400 text-zinc-900 font-bold shadow-lg hover:scale-105 transition-transform",
                sidebarCollapsed ? "" : "gap-3"
              )}>
                <Upload className="h-6 w-6" />
                {!sidebarCollapsed && <span>Upload Strategy</span>}
              </Link>
            </div>
          </aside>
        )}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Public header - only shown on public pages */}
          {!isAuthenticated && pathname !== "/login" && pathname !== "/signup" && (
            <ModernNavbar />
          )}

          {/* Authenticated header - only shown on authenticated pages */}
          {isAuthenticated && (
            <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between relative">
                <div className="flex items-center gap-6">
                  <Link href="/dashboard" className="flex items-center space-x-3 group">
                    {/* Candlestick chart icon as SVG */}
                    <span className="inline-flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="20" width="3" height="10" rx="1.5" fill="#2196F3"/>
                        <rect x="13" y="14" width="3" height="10" rx="1.5" fill="#2196F3"/>
                        <rect x="18" y="8" width="3" height="10" rx="1.5" fill="#2196F3"/>
                        <rect x="23" y="8" width="3" height="10" rx="1.5" fill="#F44336"/>
                        <rect x="28" y="14" width="3" height="10" rx="1.5" fill="#F44336"/>
                        <rect x="33" y="20" width="3" height="10" rx="1.5" fill="#F44336"/>
                      </svg>
                    </span>
                    <span className="font-extrabold text-xl tracking-tight text-foreground">Trade Crafter</span>
                  </Link>
                { /* <nav className="hidden items-center space-x-5 text-sm font-medium md:flex">
                    <Link href="/dashboard" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Dashboard</Link>
                    <Link href="/marketplace" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Marketplace</Link>
                    <Link href="/builder" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Builder</Link>
                    <Link href="/backtest" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Backtest</Link>
                    <Link href="/settings" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Settings</Link>
                  </nav> */ }
                </div>
                {/* Profile dropdown - repositioned for mobile */}
                <div className="hidden md:flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-3 py-2">
                        <div className="font-semibold">Alex Morgan</div>
                        <div className="text-xs text-muted-foreground">alex@example.com</div>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/logout">Logout</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* Mobile profile icon absolutely positioned in the right corner */}
                <div className="md:hidden">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="h-9 w-9 cursor-pointer">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div className="px-3 py-2">
                          <div className="font-semibold">Alex Morgan</div>
                          <div className="text-xs text-muted-foreground">alex@example.com</div>
                        </div>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/logout">Logout</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex-1 md:hidden">
                  <MobileNav />
                </div>
              </div>
            </header>
          )}

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

       
          <div className="mt-6 mb-3 rounded-lg  border p-6 max-w-lg mx-auto bg-black">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">We Value Your Feedback</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Have suggestions to improve our onboarding process? Let us know!
            </p>
            <Textarea
              id="feedback-textarea"
              className="mt-3 w-full resize-none border-purple-900"
              placeholder="Your feedback helps us improve..."
              rows={4}
            />
            <Button
              variant="outline"
              size="default"
              className="mt-3 w-full bg-purple-800"
              onClick={() => {
                const feedbackElement = document.getElementById("feedback-textarea") as HTMLTextAreaElement
                const feedback = feedbackElement?.value || ""
                if (feedback.trim()) {
                  sendFeedback(feedback)
                } else {
                  alert("Please enter your feedback before submitting.")
                }
              }}
            >
              Submit Feedback
            </Button>
            </div> 
        </div> 
      </div>
    </ThemeProvider>
  )
}
