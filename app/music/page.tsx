"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ShaderBackground from "@/components/shader-background"
import Link from "next/link"
import InlineEditor from "@/components/inline-editor"

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

interface Project {
  id: string
  title: string
  artist: string
  genre: string
  description: string
  services: string[]
  year: string
  image: string
}

const projects: Project[] = [
  {
    id: "project-1",
    title: "Midnight Dreams",
    artist: "Luna Echo",
    genre: "Alternative Pop",
    description: "A full-length album featuring 12 tracks of atmospheric pop with electronic elements. We handled the entire production process from recording to final mastering.",
    services: ["Music Production", "Recording", "Mixing", "Mastering"],
    year: "2024",
    image: "/placeholder.jpg"
  },
  {
    id: "project-2",
    title: "Urban Beats Vol. 3",
    artist: "Beat Master K",
    genre: "Hip-Hop",
    description: "Compilation album featuring 15 tracks from emerging hip-hop artists. Our team provided mixing and mastering services for all tracks.",
    services: ["Mixing", "Mastering", "Post-Production"],
    year: "2024",
    image: "/placeholder.jpg"
  },
  {
    id: "project-3",
    title: "Classical Fusion",
    artist: "Zurich Symphony",
    genre: "Classical",
    description: "Live recording of a classical concert featuring modern arrangements. Captured in our main studio with full orchestra setup.",
    services: ["Live Recording", "Post-Production", "Mastering"],
    year: "2023",
    image: "/placeholder.jpg"
  },
  {
    id: "project-4",
    title: "Electronic Journey",
    artist: "Synthwave Collective",
    genre: "Electronic",
    description: "EP featuring 6 tracks of synthwave and electronic music. Complete production including sound design and arrangement.",
    services: ["Music Production", "Sound Design", "Mixing", "Mastering"],
    year: "2023",
    image: "/placeholder.jpg"
  },
  {
    id: "project-5",
    title: "Acoustic Sessions",
    artist: "Sarah Rivers",
    genre: "Folk",
    description: "Intimate acoustic recording featuring voice and guitar. Minimalist approach with focus on natural sound and emotion.",
    services: ["Recording", "Mixing", "Mastering"],
    year: "2023",
    image: "/placeholder.jpg"
  },
  {
    id: "project-6",
    title: "Rock Anthems",
    artist: "Thunder Road",
    genre: "Rock",
    description: "Full album recording with live band setup. Features powerful vocals, driving guitars, and dynamic drum performances.",
    services: ["Recording", "Music Production", "Mixing", "Mastering"],
    year: "2022",
    image: "/placeholder.jpg"
  }
]

export default function WorkPage() {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch('/api/pages/slug/music')
        if (response.ok) {
          const pageData = await response.json()
          setPage(pageData)
        }
      } catch (error) {
        console.error('Error fetching music page:', error)
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

    const response = await fetch(`/api/pages/slug/music`, {
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
      
      {/* Inline Editor */}
      <InlineEditor pageSlug="music" pageTitle="Our Work" />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-20" >
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
                {page?.title || "Our Work"}
              </h1>
              <div 
                className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
                dangerouslySetInnerHTML={{ __html: page?.content || "Discover our portfolio of successful projects across various genres. From intimate acoustic sessions to full orchestral recordings, we've helped artists bring their vision to life." }}
              />
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20" >
              {projects.map((project) => (
                <div key={project.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="aspect-square bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">Project Image</span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-[#4fdce5] font-medium mb-1">{project.artist}</p>
                    <p className="text-white/60 text-sm mb-2">{project.genre} • {project.year}</p>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Services Provided:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Statistics Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-20" >
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Studio Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-[#4fdce5] mb-2">150+</div>
                  <div className="text-white/80">Projects Completed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#4fdce5] mb-2">25+</div>
                  <div className="text-white/80">Artists Worked With</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#4fdce5] mb-2">98%</div>
                  <div className="text-white/80">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#4fdce5] mb-2">5+</div>
                  <div className="text-white/80">Years Experience</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center" >
              <h3 className="text-3xl font-bold text-white mb-8">
                Ready to Create Something Amazing?
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Let&apos;s work together to bring your musical vision to life. 
                Contact us to discuss your project and get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="px-10 py-4 bg-[#4fdce5] text-black font-semibold text-lg rounded-lg hover:bg-[#3cc9d3] hover:scale-105 transition-all duration-300">
                    Start Your Project
                  </button>
                </Link>
                <Link href="/services">
                  <button className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    View Services
                  </button>
                </Link>
              </div>
              </div>
            </div>
      </main>

      <Footer />
    </ShaderBackground>
  )
}
