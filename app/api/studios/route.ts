import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/studios - Get all studios
export async function GET(request: NextRequest) {
  try {
    const studios = await prisma.studio.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(studios)
  } catch (error) {
    console.error('Error fetching studios:', error)
    return NextResponse.json({ error: 'Failed to fetch studios' }, { status: 500 })
  }
}

// POST /api/studios - Create new studio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, size, capacity, hourlyRate, dailyRate, weeklyRate, features, equipment, images } = body

    const studio = await prisma.studio.create({
      data: {
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
        isActive: true
      }
    })

    return NextResponse.json(studio)
  } catch (error) {
    console.error('Error creating studio:', error)
    return NextResponse.json({ error: 'Failed to create studio' }, { status: 500 })
  }
}
