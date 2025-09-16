import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ShaderBackground from '@/components/shader-background'
import AdvancedLiveEditor from '@/components/advanced-live-editor'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { isPublished: true },
    select: { slug: true }
  })
  
  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await prisma.page.findUnique({
    where: { 
      slug: params.slug,
      isPublished: true 
    }
  })

  if (!page) {
    notFound()
  }

  return (
    <ShaderBackground>
      <Header />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 
              className="text-5xl md:text-6xl font-bold text-white mb-8"
              data-editable
            >
              {page.title}
            </h1>
          </div>

          {/* Page Content */}
          <AdvancedLiveEditor pageId={page.id} pageSlug={page.slug}>
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
              data-editable
            />
          </AdvancedLiveEditor>
        </div>
      </main>

      <Footer />
    </ShaderBackground>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const page = await prisma.page.findUnique({
    where: { 
      slug: params.slug,
      isPublished: true 
    }
  })

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription,
  }
}
