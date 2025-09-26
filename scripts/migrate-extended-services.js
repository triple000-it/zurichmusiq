const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateExtendedServices() {
  try {
    console.log('🔄 Starting extended services migration...')

    // Clear existing services
    const existingServices = await prisma.service.findMany()
    
    if (existingServices.length > 0) {
      console.log(`Found ${existingServices.length} existing services. Clearing them...`)
      await prisma.service.deleteMany()
    }

    // Create comprehensive services
    const services = [
      {
        name: "Professional Recording",
        description: "Capture your sound with pristine clarity in our state-of-the-art recording studios. Our experienced engineers ensure every note is perfect with industry-leading equipment and acoustically treated rooms.",
        category: "Recording",
        price: 80.0,
        duration: "Flexible",
        features: [
          "High-end microphones",
          "Acoustically treated rooms", 
          "Experienced engineers",
          "Multi-track recording",
          "Professional Equipment",
          "High-Quality Output",
          "Unlimited Revisions"
        ],
        image: "/professional-recording-bg.svg",
        isActive: true
      },
      {
        name: "Mixing & Mastering",
        description: "Transform your raw tracks into polished, radio-ready masterpieces. Our mixing and mastering services bring balance, depth, and impact to your music using industry-standard software and analog gear.",
        category: "Mixing",
        price: 120.0,
        duration: "3-5 days",
        features: [
          "Industry-standard software",
          "Analog gear emulation",
          "Loudness optimization",
          "Fast Turnaround",
          "Unlimited Revisions",
          "Professional Equipment",
          "Stem mixing available"
        ],
        image: "/mixing-mastering-bg.svg",
        isActive: true
      },
      {
        name: "Audio Mastering",
        description: "Give your tracks the final polish they need for commercial release. Our mastering engineers use premium analog and digital tools to ensure your music sounds perfect on any playback system.",
        category: "Mastering",
        price: 90.0,
        duration: "2-3 days",
        features: [
          "Premium analog mastering",
          "Digital precision tools",
          "Loudness optimization",
          "Format optimization",
          "Quality assurance",
          "Industry Standards",
          "Multiple format delivery"
        ],
        image: "/mastering-bg.svg",
        isActive: true
      },
      {
        name: "Music Production",
        description: "Collaborate with our talented producers to develop your artistic vision. From songwriting to arrangement, we guide you through every step of the creative process with creative input and industry expertise.",
        category: "Production",
        price: 200.0,
        duration: "Project-based",
        features: [
          "Creative direction",
          "Arrangement & instrumentation", 
          "Session musicians",
          "Genre expertise",
          "Creative Input",
          "Industry Standards",
          "Songwriting collaboration"
        ],
        image: "/music-production-bg.svg",
        isActive: true
      },
      {
        name: "Remix Services",
        description: "Transform existing tracks into fresh, exciting versions. Our remix specialists create unique interpretations that maintain the original's essence while adding new energy and contemporary appeal.",
        category: "Production",
        price: 150.0,
        duration: "1-2 weeks",
        features: [
          "Creative reinterpretation",
          "Modern production techniques",
          "Genre crossover expertise",
          "Stem-based remixing",
          "Custom arrangements",
          "Creative Input",
          "Multiple version options"
        ],
        image: "/remix-bg.svg",
        isActive: true
      },
      {
        name: "Vocal Production",
        description: "Specialized vocal recording and production services. From intimate acoustic sessions to powerful pop vocals, we capture every nuance with professional vocal booth and expert coaching.",
        category: "Recording",
        price: 100.0,
        duration: "Half day",
        features: [
          "Professional vocal booth",
          "Vocal coaching included",
          "Multiple microphone options",
          "Harmony arrangements",
          "Vocal effects processing",
          "High-Quality Output",
          "Performance guidance"
        ],
        image: "/vocal-production-bg.svg",
        isActive: true
      },
      {
        name: "Instrumental Production",
        description: "Create compelling instrumental tracks for any genre. Our producers work with session musicians and virtual instruments to craft professional instrumental compositions for your projects.",
        category: "Production",
        price: 180.0,
        duration: "1-2 weeks",
        features: [
          "Session musicians",
          "Virtual instrument libraries",
          "Genre-specific arrangements",
          "Custom compositions",
          "Professional mixing",
          "Creative Input",
          "Multiple instrument options"
        ],
        image: "/instrumental-production-bg.svg",
        isActive: true
      },
      {
        name: "Podcast Production",
        description: "Professional podcast recording and post-production services. From interview setups to narrative podcasts, we provide complete production solutions with editing, mixing, and mastering.",
        category: "Recording",
        price: 75.0,
        duration: "Per episode",
        features: [
          "Multi-person recording",
          "Professional editing",
          "Audio enhancement",
          "Intro/outro production",
          "Quality optimization",
          "Fast Turnaround",
          "Multiple format delivery"
        ],
        image: "/podcast-production-bg.svg",
        isActive: true
      },
      {
        name: "Sound Design",
        description: "Create unique sound effects and audio elements for media projects. Our sound designers craft custom audio solutions for films, games, commercials, and multimedia applications.",
        category: "Production",
        price: 160.0,
        duration: "Project-based",
        features: [
          "Custom sound effects",
          "Foley recording",
          "Audio post-production",
          "Spatial audio design",
          "Creative soundscapes",
          "Creative Input",
          "Multiple format delivery"
        ],
        image: "/sound-design-bg.svg",
        isActive: true
      },
      {
        name: "Artist Development",
        description: "Comprehensive artist development program. We help you refine your craft, build your brand, and navigate the music industry with vocal coaching, performance training, and career guidance.",
        category: "Production",
        price: 150.0,
        duration: "Ongoing support",
        features: [
          "Vocal coaching",
          "Performance training",
          "Branding & marketing",
          "Industry networking",
          "Career guidance",
          "Consultation Included",
          "Post-Production Support"
        ],
        image: "/artist-development-bg.svg",
        isActive: true
      }
    ]

    console.log('📝 Creating comprehensive services...')
    
    for (const service of services) {
      const created = await prisma.service.create({
        data: service
      })
      console.log(`✅ Created service: ${created.name} - €${created.price},00`)
    }

    console.log('🎉 Extended services migration completed successfully!')
    console.log(`📊 Total services created: ${services.length}`)
    console.log('💰 Services now use Euro (€) pricing format')

  } catch (error) {
    console.error('❌ Error during extended services migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateExtendedServices()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
