import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import ClientLayout from "./clientLayout"
import { StrategyProvider } from "@/context/strategy-context"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
//import SmoothScroll from "./components/smooth-scroll"


const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <StrategyProvider>
             
                <ClientLayout>{children}</ClientLayout>
              
            </StrategyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}