"use client"

import Link from "next/link"

export default function HeroContent() {
  return (
    <main className="relative z-20 w-full min-h-screen lg:min-h-0 pt-40 pb-4 lg:pb-2 px-8 lg:px-16">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-6xl lg:text-8xl font-bold text-white mb-8">
          Professional{" "}
          <span className="text-[#4fdce5]">Music</span>{" "}
          Recording Studio
        </h1>
        
        <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
        From recording and mixing to mastering and production, we exceed expectations.
        </p>

        <br /><br />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-4">
          <Link href="/booking">
            <button className="px-8 py-4 bg-[#4fdce5] hover:bg-[#3cc9d3] text-black font-semibold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Book Studio Time
            </button>
          </Link>
          <Link href="/music">
            <button className="px-8 py-4 bg-black text-white font-semibold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black">
              Listen to Our Work
            </button>
          </Link>
        </div>

<br /><br />

        {/* Studio Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">Artist Development</div>
              <div className="text-sm text-white/80">Guidance and support for emerging artists</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">Mixing & Mastering</div>
              <div className="text-sm text-white/80">Expert audio engineering for radio-ready sound</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">Music Production</div>
              <div className="text-sm text-white/80">Full production services from concept to completion</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">Professional Recording</div>
              <div className="text-sm text-white/80">State-of-the-art equipment and acoustically treated rooms</div>
            </div>
          </div>
        </div>



        

        {/* Trust Indicators */}
        <div className="border-t border-white/20 pt-6 mb-2 lg:mb-0">
          <p className="text-gray-400 text-lg mb-2">Trusted by many artists, dj's, labels and music professionals.</p>
        </div>
      </div>
    </main>
  )
}
