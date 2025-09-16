const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Initializing database...')

  // Create super admin user
  const superAdmin = await prisma.user.upsert({
    where: { email: 'info@000-it.com' },
    update: {},
    create: {
      email: 'info@000-it.com',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Super admin user created:', superAdmin)

  // Create sample studios
  const studioXL = await prisma.studio.upsert({
    where: { id: 'studio-xl' },
    update: {},
    create: {
      id: 'studio-xl',
      name: 'Studio XL - Main Recording Suite',
      description: 'Our flagship recording studio featuring a large live room with high ceilings, perfect for full band recordings, orchestral sessions, and acoustic projects.',
      size: '120 m²',
      capacity: 'Up to 12 musicians',
      hourlyRate: 120,
      dailyRate: 800,
      weeklyRate: 4000,
      features: [
        'Large live room with 4m ceilings',
        '3 isolation booths',
        'Control room with SSL console',
        'Natural acoustic treatment',
        'Professional monitoring system',
        '24/7 access for members'
      ],
      equipment: {
        microphones: [
          'Neumann U87 (x2)',
          'Neumann U67',
          'Shure SM7B (x3)',
          'Sennheiser MD 421 (x4)',
          'AKG C414 (x2)',
          'Royer R-121 (x2)'
        ],
        preamps: [
          'Neve 1073 (x8)',
          'API 512c (x4)',
          'Universal Audio LA-2A',
          'Universal Audio 1176',
          'Empirical Labs Distressor (x2)',
          'Manley Voxbox'
        ],
        console: [
          'SSL Duality Delta SuperAnalogue Console',
          'Pro Tools HDX system',
          'Avid S6 control surface',
          'Barefoot Sound MM27 monitors',
          'Yamaha NS10M monitors',
          'Sennheiser HD650 headphones (x6)'
        ],
        instruments: [
          'Fender Rhodes Mark I',
          'Hammond B3 with Leslie 122',
          'Fender Twin Reverb',
          'Marshall JCM800',
          'Vox AC30',
          'Various guitars and basses'
        ]
      },
      images: ['/STUDIO-XL.png'],
      isActive: true
    },
  })

  const studioS = await prisma.studio.upsert({
    where: { id: 'studio-s' },
    update: {},
    create: {
      id: 'studio-s',
      name: 'Studio S - Production Suite',
      description: 'A versatile production studio perfect for mixing, mastering, vocal recording, and electronic music production.',
      size: '80 m²',
      capacity: 'Up to 6 musicians',
      hourlyRate: 80,
      dailyRate: 500,
      weeklyRate: 2500,
      features: [
        'Intimate recording space',
        '2 isolation booths',
        'Modern digital workflow',
        'Excellent acoustic treatment',
        'Professional monitoring',
        'Flexible booking options'
      ],
      equipment: {
        microphones: [
          'Neumann TLM 103',
          'Shure SM7B',
          'AKG C214',
          'Sennheiser e906',
          'Rode NT1',
          'Various dynamic mics'
        ],
        preamps: [
          'Focusrite ISA Two',
          'Universal Audio Apollo Twin',
          'Warm Audio WA12 (x2)',
          'Arturia AudioFuse',
          'Various plugin bundles'
        ],
        digital: [
          'Pro Tools Studio',
          'Logic Pro X',
          'Ableton Live Suite',
          'iZotope RX 10',
          'Waves Mercury Bundle',
          'Native Instruments Komplete'
        ],
        monitoring: [
          'Adam A7X monitors',
          'Sennheiser HD600 headphones',
          'Focusrite Scarlett interface',
          'Various MIDI controllers'
        ]
      },
      images: ['/STUDIO-S.png'],
      isActive: true
    },
  })

  console.log('✅ Studios created:', { studioXL, studioS })

  // Create sample services
  const services = [
    {
      id: 'mixing-mastering',
      title: 'Mixing & Mastering',
      description: 'Get your projects professionally mixed and mastered by our experienced engineers, ensuring they are polished, balanced, and ready for release on any platform.',
      features: [
        'Professional mixing for all genres',
        'Industry-standard mastering with multiple format delivery',
        'Up to 3 revision rounds included',
        'Reference track analysis and comparison',
        'Loudness optimization for streaming platforms',
        'Stem delivery for future remixes'
      ],
      pricing: 'Starting from € 150,00 per track',
      duration: '3-5 business days',
      isActive: true
    },
    {
      id: 'music-production',
      title: 'Music Production & Engineering',
      description: 'Work with top-tier producers and engineers on projects ranging from singles to full albums.',
      features: [
        'Full album production and arrangement',
        'Beat making and programming',
        'Vocal production and processing',
        'Live instrument recording',
        'Creative direction and guidance',
        'Project management and timeline coordination'
      ],
      pricing: 'Starting from € 500,00 per day',
      duration: 'Project-based (1-12 weeks)',
      isActive: true
    },
    {
      id: 'artist-development',
      title: 'Artist Development',
      description: 'Personalised coaching sessions designed to help artists find their sound and grow their careers.',
      features: [
        'One-on-one coaching sessions',
        'Career strategy planning and goal setting',
        'Performance development and stage presence',
        'Industry networking guidance',
        'Brand identity development',
        'Release strategy and marketing planning'
      ],
      pricing: '€ 120,00 per hour',
      duration: 'Flexible scheduling',
      isActive: true
    }
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    })
  }

  console.log('✅ Services created')

  // Create sample projects
  const projects = [
    {
      id: 'project-1',
      title: 'Midnight Dreams',
      artist: 'Luna Echo',
      genre: 'Alternative Pop',
      description: 'A full-length album featuring 12 tracks of atmospheric pop with electronic elements.',
      services: ['Music Production', 'Recording', 'Mixing', 'Mastering'],
      year: '2024',
      image: '/placeholder.jpg',
      isPublished: true
    },
    {
      id: 'project-2',
      title: 'Urban Beats Vol. 3',
      artist: 'Beat Master K',
      genre: 'Hip-Hop',
      description: 'Compilation album featuring 15 tracks from emerging hip-hop artists.',
      services: ['Mixing', 'Mastering', 'Post-Production'],
      year: '2024',
      image: '/placeholder.jpg',
      isPublished: true
    }
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    })
  }

  console.log('✅ Projects created')

  console.log('🎉 Database initialization complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error initializing database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
