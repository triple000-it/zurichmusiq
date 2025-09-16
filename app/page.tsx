"use client"

import Header from "@/components/header"
import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import Footer from "@/components/footer"
import PerformanceMonitor from "@/components/performance-monitor"
import AdvancedLiveEditor from "@/components/advanced-live-editor"
import SimpleLiveEditor from "@/components/simple-live-editor"
import DebugSession from "@/components/debug-session"

export default function ShaderShowcase() {
  return (
    <ShaderBackground>
      <DebugSession />
      <Header />
      <HeroContent />
      <br /><br />
      
      <SimpleLiveEditor pageId="home" pageSlug="home">
        {/* Statistics Section - Moved to bottom */}
        <section className="relative z-20 w-ful
        l px-8 lg:px-16" data-editable>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#4fdce5] mb-2">2</div>
                <div className="text-lg text-gray-300">Professional Studios</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#4fdce5] mb-2">1000+</div>
                <div className="text-lg text-gray-300">Songs Recorded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-[#4fdce5] mb-2">15+</div>
                <div className="text-lg text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      </SimpleLiveEditor>

      <Footer />
      <PulsingCircle />
      <PerformanceMonitor />
    </ShaderBackground>
  )
}
