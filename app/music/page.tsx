"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ShaderBackground from "@/components/shader-background"
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

interface Project {
  id: string
  title: string
  artist: string
  genre: string
  year: string
  description: string
  image: string
  services: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function WorkPage() {
  const [page, setPage] = useState<Page | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch page content
        const pageResponse = await fetch('/api/pages/slug/music')
        if (pageResponse.ok) {
          const pageData = await pageResponse.json()
          setPage(pageData)
        }

        // Fetch projects
        const projectsResponse = await fetch('/api/projects')
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          // Only show published projects and filter to specific ones
          const publishedProjects = projectsData.filter((project: Project) => project.isPublished)
          // Filter to show only the 3 specified projects
          const filteredProjects = publishedProjects.filter((project: Project) => 
            project.title === 'Digital Dreams' || 
            project.title === 'Rhythm of the Night' || 
            project.title === 'Echoes of the City'
          )
          setProjects(filteredProjects)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
      
      {/* Simple Inline Editor */}
      <SimpleInlineEditor pageSlug="music" pageTitle="Our Work" />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">Our Work</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover our portfolio of successful projects across various genres. 
              From intimate acoustic sessions to full orchestral recordings, we've helped artists bring their vision to life.
            </p>
          </div>

          {/* Spotify Playlist */}
          <div className="mb-20">
            <iframe 
              data-testid="embed-iframe" 
              style={{borderRadius: '12px'}} 
              src="https://open.spotify.com/embed/playlist/6BeMJ72OIm7Ra7Wp3ILCmE?utm_source=generator&theme=0" 
              width="100%" 
              height="777" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            />
          </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20" >
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-2xl font-bold text-white mb-4">No Projects Yet</h3>
                  <p className="text-white/80">Check back soon for our latest musical creations.</p>
                </div>
              ) : (
                projects.map((project) => (
                <div key={project.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="aspect-square rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder.jpg'
                      }}
                    />
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
                ))
              )}
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
                <Link href="/booking">
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
