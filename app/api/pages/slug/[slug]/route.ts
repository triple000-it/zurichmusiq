import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-simple'
import { prisma } from '@/lib/prisma'

// GET /api/pages/slug/[slug] - Get page by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const page = await prisma.page.findUnique({
      where: { 
        slug: slug,
        isPublished: true 
      }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}

// PUT /api/pages/slug/[slug] - Update page by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { content, title, metaTitle, metaDescription, updatedBy, elementType, elementText, editMetadata } = body

    // Find the page by slug
    const existingPage = await prisma.page.findUnique({
      where: { slug: slug }
    })

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Build update data object with only provided fields
    const updateData: any = {
      updatedBy: updatedBy || session.user.name || 'Inline Editor',
      updatedAt: new Date()
    }

    // Handle inline edits - update the specific content
    if (content !== undefined) {
      updateData.content = content
    } else if (elementText !== undefined && elementType !== undefined) {
      // For inline edits, we need to update the HTML content
      // This is a simplified approach - in a real app you'd want more sophisticated content management
      let updatedContent = existingPage.content
      
      // Simple text replacement - this could be enhanced with more sophisticated parsing
      if (elementType === 'h1' || elementType === 'h2' || elementType === 'h3' || 
          elementType === 'h4' || elementType === 'h5' || elementType === 'h6') {
        // Update heading content
        const headingRegex = new RegExp(`<${elementType}[^>]*>.*?</${elementType}>`, 'gi')
        updatedContent = updatedContent.replace(headingRegex, `<${elementType}>${elementText}</${elementType}>`)
      } else if (elementType === 'p') {
        // Update paragraph content - this is more complex and would need better parsing
        updateData.content = existingPage.content // For now, just keep existing content
      }
      
      updateData.content = updatedContent
    }

    if (title !== undefined) updateData.title = title
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription

    const page = await prisma.page.update({
      where: { slug: slug },
      data: updateData
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}
