const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateServices() {
  try {
    console.log('🔄 Starting services migration...')

    // First, let's check if we need to clear existing services
    const existingServices = await prisma.service.findMany()
    
    if (existingServices.length > 0) {
      console.log(`Found ${existingServices.length} existing services. Clearing them...`)
      await prisma.service.deleteMany()
    }

    // Create new services with proper structure
    const services = [
      {
        name: "Professional Recording",
        description: "Capture your sound with pristine clarity in our state-of-the-art recording studios. Our experienced engineers ensure every note is perfect.",
        category: "Recording",
        price: 80.0,
        duration: "Flexible",
        features: [
          "High-end microphones",
          "Acoustically treated rooms", 
          "Experienced engineers",
          "Multi-track recording",
          "Professional Equipment",
          "High-Quality Output"
        ],
        image: "/professional-recording-bg.svg",
        isActive: true
      },
      {
        name: "Mixing & Mastering",
        description: "Transform your raw tracks into polished, radio-ready masterpieces. Our mixing and mastering services bring balance, depth, and impact to your music.",
        category: "Mixing",
        price: 120.0,
        duration: "3-5 days",
        features: [
          "Industry-standard software",
          "Analog gear emulation",
          "Loudness optimization",
          "Fast Turnaround",
          "Unlimited Revisions",
          "Professional Equipment"
        ],
        image: "/mixing-mastering-bg.svg",
        isActive: true
      },
      {
        name: "Music Production", 
        description: "Collaborate with our talented producers to develop your artistic vision. From songwriting to arrangement, we guide you through every step of the creative process.",
        category: "Production",
        price: 200.0,
        duration: "Project-based",
        features: [
          "Creative direction",
          "Arrangement & instrumentation", 
          "Session musicians",
          "Genre expertise",
          "Creative Input",
          "Industry Standards"
        ],
        image: "/music-production-bg.svg",
        isActive: true
      },
      {
        name: "Artist Development",
        description: "Unlock your full potential with our comprehensive artist development program. We help you refine your craft, build your brand, and navigate the music industry.",
        category: "Production",
        price: 150.0,
        duration: "Ongoing support",
        features: [
          "Vocal coaching",
          "Performance training",
          "Branding & marketing",
          "Industry networking",
          "Consultation Included",
          "Post-Production Support"
        ],
        image: "/artist-development-bg.svg",
        isActive: true
      }
    ]

    console.log('📝 Creating services...')
    
    for (const service of services) {
      const created = await prisma.service.create({
        data: service
      })
      console.log(`✅ Created service: ${created.name}`)
    }

    console.log('🎉 Services migration completed successfully!')
    console.log(`📊 Total services created: ${services.length}`)

  } catch (error) {
    console.error('❌ Error during services migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateServices()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
