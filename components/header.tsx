"use client"

import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-8 lg:px-16 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/LOGO-ZURICHMUSIQ-WIT.png"
              alt="Zurich Musiq Logo"
              width={120}
              height={40}
              className="w-30 h-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
        <Link href="/about" className="text-white/80 hover:text-white transition-colors duration-200">About</Link>
        <Link href="/music" className="text-white/80 hover:text-white transition-colors duration-200">Music</Link>
        <Link href="/services" className="text-white/80 hover:text-white transition-colors duration-200">Services</Link>
        <Link href="/contact" className="text-white/80 hover:text-white transition-colors duration-200">Contact</Link>
        </nav>

        {/* CTA Button */}
        <Link href="/booking">
          <button className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-200">
            Studio Booking
          </button>
        </Link>
      </div>
    </header>
  )
}
