"use client"

import { useState } from "react"
import Link from "next/link"

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Blogs", href: "#" },
  { label: "Contact", href: "#contact" },
]

export default function ModernNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed left-1/2 top-6 z-50 -translate-x-1/2 w-[95vw] max-w-5xl rounded-3xl bg-background/90 border border-primary/20 shadow-2xl backdrop-blur-lg px-4 py-2 flex items-center justify-between gap-4 md:gap-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="inline-flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="20" width="3" height="10" rx="1.5" fill="#a259ff" />
            <rect x="13" y="14" width="3" height="10" rx="1.5" fill="#a259ff" />
            <rect x="18" y="8" width="3" height="10" rx="1.5" fill="#6a82fb" />
            <rect x="23" y="8" width="3" height="10" rx="1.5" fill="#6a82fb" />
            <rect x="28" y="14" width="3" height="10" rx="1.5" fill="#a259ff" />
            <rect x="33" y="20" width="3" height="10" rx="1.5" fill="#a259ff" />
          </svg>
        </span>
        <span className="font-extrabold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
          Trade Craft
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-1 justify-center">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="nav-link-enhanced px-4 py-2 text-base font-semibold text-foreground/80 transition-all duration-300 hover:text-primary hover:scale-105 relative group"
          >
            <span className="relative z-10">{link.label}</span>
            {/* Hover background effect */}
            <div className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
            {/* Bottom border effect */}
            <div className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
          </Link>
        ))}
      </div>

      {/* Get Started Button (Desktop) */}
      <div className="hidden md:flex items-center">
        <Link
          href="/signup"
          className="btn-primary-enhanced shadow-lg px-6 py-2 text-base font-bold ml-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
        >
          Get started
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        <svg
          className="h-6 w-6 text-foreground transition-transform duration-200 hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute left-0 top-[110%] w-full bg-background/95 rounded-2xl shadow-xl border border-primary/20 flex flex-col items-center gap-2 py-4 z-50 backdrop-blur-lg animate-fade-in-scale">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className="mobile-nav-link w-11/12 text-center px-4 py-3 text-base font-semibold text-foreground/80 transition-all duration-300 hover:text-primary hover:bg-primary/10 rounded-lg relative group"
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="relative z-10">{link.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
            </Link>
          ))}
          <Link
            href="#"
            className="mt-2 btn-primary-enhanced w-11/12 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
            onClick={() => setMobileOpen(false)}
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  )
}
