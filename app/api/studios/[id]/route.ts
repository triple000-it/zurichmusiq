import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-simple'
import { prisma } from '@/lib/prisma'

// GET /api/studios/[id] - Get specific studio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const studio = await prisma.studio.findUnique({
      where: { id }
    })

    if (!studio) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
    }

    return NextResponse.json(studio)
  } catch (error) {
    console.error('Error fetching studio:', error)
    return NextResponse.json({ error: 'Failed to fetch studio' }, { status: 500 })
  }
}

// PUT /api/studios/[id] - Update studio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      size, 
      capacity, 
      hourlyRate, 
      dailyRate, 
      weeklyRate, 
      features, 
      equipment, 
      images, 
      isActive 
    } = body

    // Check if studio exists
    const existingStudio = await prisma.studio.findUnique({
      where: { id }
    })

    if (!existingStudio) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
    }

    // Build update data object with only provided fields
    const updateData: any = {
      updatedAt: new Date()
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (size !== undefined) updateData.size = size
    if (capacity !== undefined) updateData.capacity = capacity
    if (hourlyRate !== undefined) updateData.hourlyRate = parseFloat(hourlyRate)
    if (dailyRate !== undefined) updateData.dailyRate = parseFloat(dailyRate)
    if (weeklyRate !== undefined) updateData.weeklyRate = parseFloat(weeklyRate)
    if (features !== undefined) updateData.features = features
    if (equipment !== undefined) updateData.equipment = equipment
    if (images !== undefined) updateData.images = images
    if (isActive !== undefined) updateData.isActive = isActive

    const studio = await prisma.studio.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(studio)
  } catch (error) {
    console.error('Error updating studio:', error)
    return NextResponse.json({ error: 'Failed to update studio' }, { status: 500 })
  }
}

// DELETE /api/studios/[id] - Delete studio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const studio = await prisma.studio.findUnique({
      where: { id },
      include: {
        bookings: true
      }
    })

    if (!studio) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
    }

    // Check if studio has active bookings
    if (studio.bookings.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete studio with existing bookings. Please cancel all bookings first.' 
      }, { status: 400 })
    }

    await prisma.studio.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Studio deleted successfully' })
  } catch (error) {
    console.error('Error deleting studio:', error)
    return NextResponse.json({ error: 'Failed to delete studio' }, { status: 500 })
  }
}
