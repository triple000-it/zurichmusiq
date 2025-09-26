const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateServiceTableStructure() {
  try {
    console.log('🔄 Starting Service table structure migration...')

    // Step 1: Add new columns to existing Service table
    console.log('📋 Adding new columns to Service table...')
    
    try {
      // Add title column
      await prisma.$executeRaw`ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "title" TEXT`
      console.log('✅ Added title column')
      
      // Add pricing column  
      await prisma.$executeRaw`ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "pricing" TEXT`
      console.log('✅ Added pricing column')
      
      // Remove old columns if they exist
      try {
        await prisma.$executeRaw`ALTER TABLE "Service" DROP COLUMN IF EXISTS "name"`
        console.log('✅ Removed old name column')
      } catch (e) {
        console.log('ℹ️ Name column already removed or never existed')
      }
      
      try {
        await prisma.$executeRaw`ALTER TABLE "Service" DROP COLUMN IF EXISTS "price"`
        console.log('✅ Removed old price column')
      } catch (e) {
        console.log('ℹ️ Price column already removed or never existed')
      }
      
      try {
        await prisma.$executeRaw`ALTER TABLE "Service" DROP COLUMN IF EXISTS "category"`
        console.log('✅ Removed old category column')
      } catch (e) {
        console.log('ℹ️ Category column already removed or never existed')
      }
      
      try {
        await prisma.$executeRaw`ALTER TABLE "Service" DROP COLUMN IF EXISTS "image"`
        console.log('✅ Removed old image column')
      } catch (e) {
        console.log('ℹ️ Image column already removed or never existed')
      }
      
    } catch (error) {
      console.log('⚠️ Error modifying table structure:', error.message)
    }

    // Step 2: Clear existing services and create new ones
    console.log('🗑️ Clearing existing services...')
    await prisma.$executeRaw`DELETE FROM "Service"`

    // Step 3: Create new services with correct structure
    const services = [
      {
        title: "Professional Recording",
        description: "Capture your sound with pristine clarity in our state-of-the-art recording studios. Our experienced engineers ensure every note is perfect with industry-leading equipment and acoustically treated rooms.",
        pricing: "€ 80,00",
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
        isActive: true
      },
      {
        title: "Mixing & Mastering",
        description: "Transform your raw tracks into polished, radio-ready masterpieces. Our mixing and mastering services bring balance, depth, and impact to your music using industry-standard software and analog gear.",
        pricing: "€ 120,00",
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
        isActive: true
      },
      {
        title: "Audio Mastering",
        description: "Give your tracks the final polish they need for commercial release. Our mastering engineers use premium analog and digital tools to ensure your music sounds perfect on any playback system.",
        pricing: "€ 90,00",
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
        isActive: true
      },
      {
        title: "Music Production",
        description: "Collaborate with our talented producers to develop your artistic vision. From songwriting to arrangement, we guide you through every step of the creative process with creative input and industry expertise.",
        pricing: "€ 200,00",
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
        isActive: true
      },
      {
        title: "Remix Services",
        description: "Transform existing tracks into fresh, exciting versions. Our remix specialists create unique interpretations that maintain the original's essence while adding new energy and contemporary appeal.",
        pricing: "€ 150,00",
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
        isActive: true
      },
      {
        title: "Vocal Production",
        description: "Specialized vocal recording and production services. From intimate acoustic sessions to powerful pop vocals, we capture every nuance with professional vocal booth and expert coaching.",
        pricing: "€ 100,00",
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
        isActive: true
      },
      {
        title: "Instrumental Production",
        description: "Create compelling instrumental tracks for any genre. Our producers work with session musicians and virtual instruments to craft professional instrumental compositions for your projects.",
        pricing: "€ 180,00",
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
        isActive: true
      },
      {
        title: "Podcast Production",
        description: "Professional podcast recording and post-production services. From interview setups to narrative podcasts, we provide complete production solutions with editing, mixing, and mastering.",
        pricing: "€ 75,00",
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
        isActive: true
      },
      {
        title: "Sound Design",
        description: "Create unique sound effects and audio elements for media projects. Our sound designers craft custom audio solutions for films, games, commercials, and multimedia applications.",
        pricing: "€ 160,00",
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
        isActive: true
      },
      {
        title: "Artist Development",
        description: "Comprehensive artist development program. We help you refine your craft, build your brand, and navigate the music industry with vocal coaching, performance training, and career guidance.",
        pricing: "€ 150,00",
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
        isActive: true
      }
    ]

    console.log('📝 Creating services with new structure...')
    
    for (const service of services) {
      const created = await prisma.service.create({
        data: service
      })
      console.log(`✅ Created service: ${created.title} - ${created.pricing}`)
    }

    console.log('🎉 Service table migration completed successfully!')
    console.log(`📊 Total services created: ${services.length}`)
    console.log('💰 All other tables and data preserved')

  } catch (error) {
    console.error('❌ Error during Service table migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateServiceTableStructure()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
