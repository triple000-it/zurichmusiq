const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createSampleProjects() {
  try {
    console.log('🔄 Creating sample projects...')

    // Clear existing projects first
    console.log('🗑️ Clearing existing projects...')
    await prisma.project.deleteMany()

    // Create 6 sample projects
    const projects = [
      {
        title: "Echoes of the City",
        artist: "Urban Symphony",
        genre: "Electronic",
        year: "2023",
        description: "A groundbreaking electronic album that captures the pulse of urban life. Featuring innovative sound design and atmospheric compositions that transport listeners through the bustling streets of modern cities.",
        image: "/placeholder.jpg",
        services: ["Professional Recording", "Mixing & Mastering", "Music Production"],
        isPublished: true
      },
      {
        title: "Whispering Pines",
        artist: "Acoustic Soul",
        genre: "Folk",
        year: "2022",
        description: "An intimate folk collection that explores themes of nature, love, and introspection. Recorded in our Studio XL with natural acoustics, this album showcases the raw beauty of acoustic instruments.",
        image: "/placeholder.jpg",
        services: ["Professional Recording", "Audio Mastering"],
        isPublished: true
      },
      {
        title: "Rhythm of the Night",
        artist: "Groove Collective",
        genre: "Funk",
        year: "2023",
        description: "A high-energy funk masterpiece that gets you moving. Featuring tight rhythm sections, soulful vocals, and infectious grooves that pay homage to the golden era of funk music.",
        image: "/placeholder.jpg",
        services: ["Professional Recording", "Mixing & Mastering", "Vocal Production"],
        isPublished: true
      },
      {
        title: "Celestial Harmonies",
        artist: "Starlight Ensemble",
        genre: "Classical",
        year: "2022",
        description: "A majestic classical composition performed by our resident orchestra. This project demonstrates the power of live orchestral recording in our acoustically perfect Studio XL.",
        image: "/placeholder.jpg",
        services: ["Professional Recording", "Audio Mastering", "Sound Design"],
        isPublished: true
      },
      {
        title: "Digital Dreams",
        artist: "Neon Waves",
        genre: "Synthwave",
        year: "2024",
        description: "A retro-futuristic synthwave journey through neon-lit landscapes. This project combines vintage synthesizers with modern production techniques to create an immersive audio experience.",
        image: "/placeholder.jpg",
        services: ["Music Production", "Mixing & Mastering", "Sound Design"],
        isPublished: true
      },
      {
        title: "Mountain Echoes",
        artist: "Alpine Folk",
        genre: "World Music",
        year: "2023",
        description: "A celebration of traditional Alpine music with contemporary arrangements. Recorded using authentic instruments and featuring local musicians, this project bridges past and present.",
        image: "/placeholder.jpg",
        services: ["Professional Recording", "Music Production", "Artist Development"],
        isPublished: true
      }
    ]

    console.log('📝 Creating projects in database...')
    
    for (const project of projects) {
      const created = await prisma.project.create({
        data: project
      })
      console.log(`✅ Created project: ${created.title} by ${created.artist} (${created.genre}, ${created.year})`)
    }

    console.log('🎉 Sample projects created successfully!')
    console.log(`📊 Total projects created: ${projects.length}`)
    console.log('🎵 All projects are published and ready for display')

  } catch (error) {
    console.error('❌ Error creating sample projects:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
createSampleProjects()
  .catch((error) => {
    console.error('Project creation failed:', error)
    process.exit(1)
  })
