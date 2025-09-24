"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import Image from "next/image"
import Link from "next/link"
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

interface TeamMember {
  name: string
  role: string
  bio: string
  expertise: string[]
}

const teamMembers: TeamMember[] = [
  {
    name: "Marcus Weber",
    role: "Founder & Lead Engineer",
    bio: "With over 15 years of experience in music production, Marcus has worked with artists across all genres. His passion for sound quality and attention to detail has made him one of Switzerland's most sought-after engineers.",
    expertise: ["Mixing", "Mastering", "Music Production", "Studio Design"]
  },
  {
    name: "Elena Rodriguez",
    role: "Senior Producer",
    bio: "Elena brings a unique blend of classical training and modern production techniques. She specializes in helping artists find their authentic voice while maintaining commercial appeal.",
    expertise: ["Artist Development", "Music Production", "Vocal Production", "Arrangement"]
  },
  {
    name: "David Chen",
    role: "Studio Manager & Engineer",
    bio: "David ensures every session runs smoothly while maintaining our high standards of audio quality. His technical expertise covers everything from analog gear to the latest digital tools.",
    expertise: ["Recording", "Studio Management", "Equipment Maintenance", "Technical Support"]
  },
  {
    name: "Sophie Müller",
    role: "Marketing & Artist Relations",
    bio: "Sophie helps artists build their brand and connect with their audience. Her industry connections and strategic thinking have helped numerous artists achieve breakthrough success.",
    expertise: ["Branding", "Marketing Strategy", "Industry Networking", "Artist Relations"]
  }
]

export default function AboutPage() {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/pages/slug/about')
        if (response.ok) {
          const pageData = await response.json()
          setPage(pageData)
        }
      } catch (error) {
        console.error('Error fetching about page:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [])

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
      <SimpleInlineEditor pageSlug="about" pageTitle="About Us" />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
            {/* Dynamic Content from Database */}
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page?.content || `
                <div class="text-center mb-20">
                  <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">About Us</h1>
                  <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                    We're a passionate team of music professionals dedicated to helping artists 
                    create their best work in a world-class recording environment.
                  </p>
                </div>
              ` }}
            />

            </div>
      </main>

      <Footer />
      <PulsingCircle />
    </ShaderBackground>
  )
}
