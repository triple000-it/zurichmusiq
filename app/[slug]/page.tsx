"use client"

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ShaderBackground from '@/components/shader-background'
import FrontendPageEditor from '@/components/frontend-page-editor'

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

interface PageProps {
  params: {
    slug: string
  }
}

export default function DynamicPage({ params }: PageProps) {
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages/slug/${params.slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch page')
        }
        const pageData = await response.json()
        setPage(pageData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [params.slug])

  const handleSave = async (data: {
    title: string
    content: string
    metaTitle?: string
    metaDescription?: string
  }) => {
    if (!page) return

    const response = await fetch(`/api/pages/${page.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        updatedBy: 'Frontend Editor'
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to save page')
    }

    const updatedPage = await response.json()
    setPage(updatedPage)
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

  if (error || !page) {
    return (
      <ShaderBackground>
        <Header />
        <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
            <p className="text-white/80">{error || "The page you're looking for doesn't exist."}</p>
          </div>
        </main>
        <Footer />
      </ShaderBackground>
    )
  }

  return (
    <ShaderBackground>
      <Header />
      
      {/* Frontend Editor */}
      <FrontendPageEditor
        pageId={page.id}
        initialTitle={page.title}
        initialContent={page.content}
        initialMetaTitle={page.metaTitle || ""}
        initialMetaDescription={page.metaDescription || ""}
        onSave={handleSave}
      />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 
              className="text-5xl md:text-6xl font-bold text-white mb-8"
            >
              {page.title}
            </h1>
          </div>

          {/* Page Content */}
          <div 
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>

      <Footer />
    </ShaderBackground>
  )
}

// Metadata will be handled by the client component
