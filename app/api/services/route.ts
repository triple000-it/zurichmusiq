import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-simple'
import { prisma } from '@/lib/prisma'

// GET /api/services - Get all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// POST /api/services - Create new service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, category, price, duration, features, image, isActive } = body

    // Validate required fields
    if (!name || !description || !category || price === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, description, category, price' 
      }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        category,
        price: parseFloat(price),
        duration: duration || '',
        features: features || [],
        image: image || '',
        isActive: isActive !== undefined ? isActive : true,
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}