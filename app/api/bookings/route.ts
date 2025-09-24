import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-simple'
import { prisma } from '@/lib/prisma'

// GET /api/bookings - Get all bookings (admin only) or user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // If admin, get all bookings
    if (session.user.role && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)) {
      const bookings = await prisma.booking.findMany({
        include: {
          studio: true,
          user: true
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(bookings)
    }

    // If regular user, get only their bookings
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        studio: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      studioId, 
      date, 
      startTime, 
      duration, 
      totalCost, 
      notes,
      addons 
    } = body

    // Validate required fields
    if (!studioId || !date || !startTime || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if studio exists
    const studio = await prisma.studio.findUnique({
      where: { id: studioId }
    })

    if (!studio) {
      return NextResponse.json({ error: 'Studio not found' }, { status: 404 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        studioId,
        date: new Date(date),
        startTime,
        duration: parseInt(duration),
        totalCost: parseFloat(totalCost),
        status: 'PENDING',
        notes: notes || '',
        addons: addons || [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        studio: true,
        user: true
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}