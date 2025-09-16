import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/pages - Get all pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// POST /api/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { title, slug, content, metaTitle, metaDescription, isPublished } = body

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    })

    if (existingPage) {
      return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 400 })
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        isPublished: isPublished || false,
        createdBy: session.user.name || 'Unknown',
        updatedBy: session.user.name || 'Unknown'
      }
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
