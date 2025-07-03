"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart4, Home, Menu, Settings, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Only show for authenticated routes
  const isAuthenticatedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/builder") ||
    pathname.startsWith("/backtest") ||
    pathname.startsWith("/strategies") ||
    pathname.startsWith("/settings")

  if (!isAuthenticatedRoute) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex items-center justify-between border-b pb-4">
          <Link href="/dashboard" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">in_luencer</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
       <nav className="mt-4 flex flex-col space-y-4">
          { /* <Link
            href="/dashboard"
            className="flex items-center rounded-md px-2 py-1 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Link> */ }
       {/*   <Link
            href="/marketplace"
            className="flex items-center rounded-md px-2 py-1 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <BarChart4 className="mr-2 h-5 w-5" />
            MarketPlace
          </Link> */}
          <Link
            href="/builder"
            className="flex items-center rounded-md px-2 py-1 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <BarChart4 className="mr-2 h-5 w-5" />
            Builder
          </Link>
         <Link
            href="/backtest"
            className="flex items-center rounded-md px-2 py-1 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <BarChart4 className="mr-2 h-5 w-5" />
            Backtest
          </Link>  
         {/* <Link
            href="/settings"
            className="flex items-center rounded-md px-2 py-1 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Link> */ }
        </nav>
      </SheetContent>
    </Sheet>
  )
}
