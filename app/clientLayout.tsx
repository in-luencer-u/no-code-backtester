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
import { MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ModernNavbar from "@/components/ui/ModernNavbar"

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
      "/strategy/upload"
    ]

    const isAuthRoute = authenticatedRoutes.some((route) => pathname?.startsWith(route))
    const isAuthPage = pathname === "/login" || pathname === "/signup"

    setIsAuthenticated(isAuthRoute && !isAuthPage)
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex">
        {/* Sidebar for authenticated users */}
        {isAuthenticated && (
          <aside className={`hidden md:flex flex-col h-screen bg-background border-r border-primary/10 sticky top-0 z-40 transition-all duration-300 ${sidebarCollapsed ? 'w-16 p-2' : 'w-64 p-6'}`}>
            {/* Collapse/Expand button */}
            <button
              className={`self-end mb-4 p-1 rounded hover:bg-primary/10 transition-colors ${sidebarCollapsed ? 'mx-auto' : ''}`}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
              )}
            </button>
            {/* Profile section - hidden when collapsed */}
            {!sidebarCollapsed && (
              <div className="flex flex-col items-center mb-8">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-lg">Alex Morgan</span>
                <span className="text-xs text-muted-foreground">alex@example.com</span>
              </div>
            )}
            {/* Navigation links */}
            <nav className="flex flex-col gap-3 mt-4">
              <Link href="/dashboard" className={`flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors h-12 ${sidebarCollapsed ? '' : 'px-3 py-2 gap-2 justify-start'}`}> 
                <svg width="20" height="20" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="4" height="10" rx="1.5"/><rect x="8" y="4" width="4" height="14" rx="1.5"/><rect x="14" y="10" width="4" height="8" rx="1.5"/></svg>
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Link>
              <Link href="/marketplace" className={`flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors h-12 ${sidebarCollapsed ? '' : 'px-3 py-2 gap-2 justify-start'}`}>
                <svg width="20" height="20" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8"/></svg>
                {!sidebarCollapsed && <span>Marketplace</span>}
              </Link>
              <Link href="/builder" className={`flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors h-12 ${sidebarCollapsed ? '' : 'px-3 py-2 gap-2 justify-start'}`}>
                <svg width="20" height="20" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="12" height="12" rx="2"/></svg>
                {!sidebarCollapsed && <span>Builder</span>}
              </Link>
              <Link href="/backtest" className={`flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors h-12 ${sidebarCollapsed ? '' : 'px-3 py-2 gap-2 justify-start'}`}>
                <svg width="20" height="20" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v-2a4 4 0 014-4h8"/><circle cx="16" cy="17" r="2"/></svg>
                {!sidebarCollapsed && <span>Backtest</span>}
              </Link>
              <Link href="/settings" className={`flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors h-12 ${sidebarCollapsed ? '' : 'px-3 py-2 gap-2 justify-start'}`}>
                <svg width="20" height="20" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09c.2.63.77 1.09 1.51 1.09H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                {!sidebarCollapsed && <span>Settings</span>}
              </Link>
              <Link href="/strategy/upload" className={`flex items-center justify-center mt-4 rounded-md bg-gradient-to-r from-yellow-400 via-primary to-purple-400 text-zinc-900 font-bold shadow-lg hover:scale-105 transition-transform text-center h-12 ${sidebarCollapsed ? '' : 'px-3 py-2 gap-2 justify-start'}`}>
                <svg width="20" height="20" fill="none" stroke="#F44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m7-7H5"/></svg>
                {!sidebarCollapsed && <span>Upload Strategy</span>}
              </Link>
            </nav>
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
                  <nav className="hidden items-center space-x-5 text-sm font-medium md:flex">
                    <Link href="/dashboard" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Dashboard</Link>
                    <Link href="/marketplace" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Marketplace</Link>
                    <Link href="/builder" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Builder</Link>
                    <Link href="/backtest" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Backtest</Link>
                    <Link href="/settings" className="transition-colors hover:text-primary underline-offset-4 hover:underline px-2 py-1 rounded-md">Settings</Link>
                  </nav>
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

          {/* Feedback Form */}
          <div className="mt-8 rounded-lg border p-6 max-w-lg mx-auto">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">We Value Your Feedback</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Have suggestions to improve our onboarding process? Let us know!
            </p>
            <Textarea
              id="feedback-textarea"
              className="mt-3 w-full resize-none"
              placeholder="Your feedback helps us improve..."
              rows={4}
            />
            <Button
              variant="outline"
              size="default"
              className="mt-3 w-full"
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
