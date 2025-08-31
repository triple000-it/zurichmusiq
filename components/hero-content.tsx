"use client"

import Link from "next/link"

export default function HeroContent() {
  return (
    <main className="relative z-20 w-full min-h-screen pt-40 pb-20 px-8 lg:px-16">
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

        {/* Studio Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="relative text-center p-6 rounded-xl border border-white/10 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  rgba(0,0,0,0.8) 0%, 
                  rgba(0,0,0,0.6) 50%, 
                  rgba(0,0,0,0.8) 100%
                ), url('/artist-development-bg.svg')`
              }}
            />
            <div className="relative z-10">
              <div className="text-lg font-semibold text-white mb-2">Artist Development</div>
              <div className="text-sm text-gray-300">Guidance and support for emerging artists</div>
            </div>
          </div>
          <div className="relative text-center p-6 rounded-xl border border-white/10 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  rgba(0,0,0,0.8) 0%, 
                  rgba(0,0,0,0.6) 50%, 
                  rgba(0,0,0,0.8) 100%
                ), url('/mixing-mastering-bg.svg')`
              }}
            />
            <div className="relative z-10">
              <div className="text-lg font-semibold text-white mb-2">Mixing & Mastering</div>
              <div className="text-sm text-gray-300">Expert audio engineering for radio-ready sound</div>
            </div>
          </div>
          <div className="relative text-center p-6 rounded-xl border border-white/10 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  rgba(0,0,0,0.8) 0%, 
                  rgba(0,0,0,0.6) 50%, 
                  rgba(0,0,0,0.8) 100%
                ), url('/music-production-bg.svg')`
              }}
            />
            <div className="relative z-10">
              <div className="text-lg font-semibold text-white mb-2">Music Production</div>
              <div className="text-sm text-gray-300">Full production services from concept to completion</div>
            </div>
          </div>
          <div className="relative text-center p-6 rounded-xl border border-white/10 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  rgba(0,0,0,0.8) 0%, 
                  rgba(0,0,0,0.6) 50%, 
                  rgba(0,0,0,0.8) 100%
                ), url('/professional-recording-bg.svg')`
              }}
            />
            <div className="relative z-10">
              <div className="text-lg font-semibold text-white mb-2">Professional Recording</div>
              <div className="text-sm text-gray-300">State-of-the-art equipment and acoustically treated rooms</div>
            </div>
          </div>
        </div>



        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
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

        {/* Trust Indicators */}
        <div className="border-t border-white/20 pt-12">
          <p className="text-gray-400 text-lg mb-6">Trusted by many artists, dj's, labels and music professionals.</p>
          
        </div>
      </div>
    </main>
  )
}
