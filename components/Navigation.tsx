"use client"

import { useState, useEffect } from "react"

interface NavigationProps {
  onStartDemo?: () => void
  showMenuButton?: boolean
}

export default function Navigation({ onStartDemo, showMenuButton = true }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 lg:px-8">
      <div
        className={`transition-all duration-500 ease-in-out ${
          isScrolled
            ? "mt-3 sm:mt-4 mx-auto max-w-fit bg-black/30 backdrop-blur-md border border-orange-500/30 shadow-2xl shadow-orange-500/20 rounded-full"
            : "mt-0 w-full bg-transparent border-b border-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-center ${isScrolled ? "h-10 sm:h-12 px-3 sm:px-4" : "h-12 sm:h-14 md:h-16"}`}
        >
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 py-0 px-0">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl" />
              <img
                src="/LogoInovaFluxo1.png"
                alt="InovaFluxo"
                className="relative rounded-full w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12"
              />
            </div>
            <h1 className="text-sm sm:text-base md:text-xl font-bold bg-gradient-to-r from-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent font-heading px-0">
              iNovaFluxo
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}
