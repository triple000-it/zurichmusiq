"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ShaderBackground from "@/components/shader-background"
import PulsingCircle from "@/components/pulsing-circle"
import SimpleInlineEditor from "@/components/simple-inline-editor"

interface Page {
  id: string
  slug: string
  title: string
  content: string
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
  updatedBy: string | null
}



interface Service {
  id: string
  title: string
  description: string
  features: string[]
  pricing: string
  duration: string
}

const services: Service[] = [
  {
    id: "mixing-mastering",
    title: "Mixing & Mastering",
    description: "Get your projects professionally mixed and mastered by our experienced engineers, ensuring they are polished, balanced, and ready for release on any platform. We use industry-standard equipment and techniques to deliver broadcast-quality results.",
    features: [
      "Professional mixing for all genres (Pop, Rock, Hip-Hop, Electronic, Classical)",
      "Industry-standard mastering with multiple format delivery",
      "Up to 3 revision rounds included",
      "Reference track analysis and comparison",
      "Loudness optimization for streaming platforms",
      "Stem delivery for future remixes"
    ],
          pricing: "Starting from € 150,00 per track",
    duration: "3-5 business days"
  },
  {
    id: "music-production",
    title: "Music Production & Engineering",
    description: "Work with top-tier producers and engineers on projects ranging from singles to full albums. We bring your musical vision to life with cutting-edge technology and creative expertise. From initial concept to final mix, we're with you every step of the way.",
    features: [
      "Full album production and arrangement",
      "Beat making and programming",
      "Vocal production and processing",
      "Live instrument recording",
      "Creative direction and guidance",
      "Project management and timeline coordination"
    ],
          pricing: "Starting from € 500,00 per day",
    duration: "Project-based (1-12 weeks)"
  },
  {
    id: "artist-development",
    title: "Artist Development",
    description: "Personalised coaching sessions designed to help artists find their sound and grow their careers. Perfect to unlock your full potential and navigate the music industry. Our experienced mentors provide one-on-one guidance tailored to your specific goals.",
    features: [
      "One-on-one coaching sessions (in-person or online)",
      "Career strategy planning and goal setting",
      "Performance development and stage presence",
      "Industry networking guidance and introductions",
      "Brand identity development and positioning",
      "Release strategy and marketing planning"
    ],
          pricing: "€ 120,00 per hour",
    duration: "Flexible scheduling"
  },
  {
    id: "courses",
    title: "Producer & Engineering Courses",
    description: "Learn the skills to produce beats and professional engineering through hands-on training with our experienced team. Perfect for those wanting to take control of their own production or start a new career in the industry. Our courses combine theory with practical application.",
    features: [
      "Hands-on practical training in professional studios",
      "Industry-standard software training (Pro Tools, Logic, Ableton)",
      "Mixing and mastering techniques and workflows",
      "Music theory fundamentals and composition",
      "Portfolio building projects and assignments",
      "Industry guest speakers and networking events"
    ],
          pricing: "€ 2.500,00 for 8-week course",
    duration: "8 weeks (2 sessions per week)"
  },
  {
    id: "studio-rentals",
    title: "Studio Rentals",
    description: "Our fully equipped studios are Plug & Play and are available for rent, providing the perfect environment to bring your sounds to life. We also offer the option to include a professional engineer, ensuring you have the best support and experience during your session.",
    features: [
      "Professional recording equipment (Neumann, Shure, Sennheiser)",
      "Multiple studio configurations (Live Room, Control Room, Isolation Booth)",
      "Professional engineer assistance available",
      "Flexible booking options (hourly, daily, weekly)",
      "Competitive hourly rates with equipment included",
      "24/7 access for extended sessions"
    ],
          pricing: "€ 80,00 per hour (equipment included)",
    duration: "Flexible booking"
  },
  {
    id: "branding-marketing",
    title: "Branding & Marketing",
    description: "We help artists develop their personal brand and connect with their audience. Manage projects, and navigate the complexities of the music business with strategic marketing and branding support. From social media strategy to press kit creation, we've got you covered.",
    features: [
      "Brand identity development and visual design",
      "Social media strategy and content planning",
      "Press kit creation and media materials",
      "Release campaign planning and execution",
      "Industry relationship building and networking",
      "Performance and tour marketing support"
    ],
          pricing: "Starting from € 200,00 per month",
    duration: "Ongoing support"
  }
]

export default function ServicesPage() {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service>(services[0])

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/pages/slug/services')
        if (response.ok) {
          const pageData = await response.json()
          setPage(pageData)
        }
      } catch (error) {
        console.error('Error fetching services page:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [])

  const handleSave = async (data: {
    title: string
    content: string
    metaTitle?: string
    metaDescription?: string
  }) => {
    if (!page) return

    const response = await fetch(`/api/pages/slug/services`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        updatedBy: 'Inline Editor'
      }),
    })

    if (response.ok) {
      const updatedPage = await response.json()
      setPage(updatedPage)
    }
  }

  if (loading) {
    return (
      <ShaderBackground>
        <Header />
        <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </main>
        <Footer />
      </ShaderBackground>
    )
  }

  return (
    <ShaderBackground>
      <Header />
      
      {/* Simple Inline Editor */}
      <SimpleInlineEditor pageSlug="services" pageTitle="Our Services" />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
            {/* Dynamic Content from Database */}
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page?.content || `
                <div class="text-center mb-20">
                  <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">Our Services</h1>
                  <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                    Professional music production, recording, and artist development services 
                    to help you create, record, and succeed in the music industry.
                  </p>
                </div>
              ` }}
            />

            {/* Service Categories Menu */}
            <div className="flex flex-wrap justify-center gap-4 mb-16" >
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    selectedService.id === service.id
                      ? "bg-white/20 text-white font-semibold border border-white/40"
                      : "text-white hover:text-[#4fdce5] border border-white/20 hover:border-white/40 bg-white/10"
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>

          {/* Selected Service Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Service Information */}
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  {selectedService.title}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  {selectedService.description}
                </p>
                
                {/* Pricing and Duration */}
                <div className="bg-white/20 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 font-medium">Pricing:</span>
                    <span className="text-[#4fdce5] font-bold">{selectedService.pricing}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white/80 font-medium">Duration:</span>
                    <span className="text-[#4fdce5] font-bold">{selectedService.duration}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/contact">
                  <button className="w-full px-8 py-4 bg-[#4fdce5] text-black font-semibold rounded-lg hover:bg-[#3cc9d3] transition-colors duration-300">
                    Get Started
                  </button>
                </Link>
              </div>

              {/* Features List */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">What's Included</h3>
                <div className="space-y-4">
                  {selectedService.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#4fdce5] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/80 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

            {/* Additional Info Section */}
            <div className="mt-20 text-center" >
              <h3 className="text-3xl font-bold text-white mb-8">
                Ready to Start Your Project?
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Contact us today to discuss your project requirements and get a personalized quote. 
                Our team is ready to help you bring your musical vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="px-10 py-4 bg-[#4fdce5] text-black font-semibold text-lg rounded-lg hover:bg-[#3cc9d3] hover:scale-105 transition-all duration-300">
                    Contact Us
                  </button>
                </Link>
                <Link href="/music">
                  <button className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    View Our Work
                  </button>
                </Link>
              </div>
              </div>
            </div>
      </main>

      <Footer />
      <PulsingCircle />
    </ShaderBackground>
  )
}
