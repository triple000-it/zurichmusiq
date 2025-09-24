const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateMockData() {
  try {
    console.log('🚀 Starting migration of mock data to database...')

    // 1. Create Pages
    console.log('📄 Creating pages...')
    const pages = [
      {
        slug: 'home',
        title: 'Zurich Musiq - Professional Music Studio',
        content: `
          <div class="hero-section">
            <h1>Welcome to Zurich Musiq</h1>
            <p>Professional music recording studio in the heart of Zurich</p>
          </div>
          <div class="services-preview">
            <h2>Our Services</h2>
            <p>Professional recording, mixing, mastering, and music production services</p>
          </div>
        `,
        metaTitle: 'Zurich Musiq - Professional Music Studio',
        metaDescription: 'Professional music recording studio in Zurich offering recording, mixing, mastering, and production services.',
        isPublished: true,
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        slug: 'about',
        title: 'About Us',
        content: `
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">About Us</h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              We're a passionate team of music professionals dedicated to helping artists 
              create their best work in a world-class recording environment.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-20">
            <h2 class="text-4xl font-bold text-white mb-8 text-center">Our Story</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p class="text-white/80 text-lg leading-relaxed mb-6">
                  Founded in 2010, Zurich Musiq began as a small recording studio with a big dream: to provide world-class recording facilities to artists of all levels. What started as a passion project has grown into one of Switzerland's most respected recording studios.
                </p>
                <p class="text-white/80 text-lg leading-relaxed mb-6">
                  Over the years, we've had the privilege of working with emerging artists, established musicians, and everything in between. Our commitment to quality and innovation has earned us recognition in the music industry and the trust of our clients.
                </p>
                <p class="text-white/80 text-lg leading-relaxed">
                  Today, we continue to push the boundaries of what's possible in music production, combining cutting-edge technology with time-tested techniques to help artists create their best work.
                </p>
              </div>
              <div class="bg-gray-300 rounded-lg aspect-square flex items-center justify-center">
                <span class="text-gray-600 text-sm">Studio Photo</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 class="text-2xl font-bold text-white mb-6">Our Mission</h3>
              <p class="text-white/80 leading-relaxed">
                To provide world-class recording facilities and professional guidance that empowers artists 
                to create their best work, regardless of their budget or experience level.
              </p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 class="text-2xl font-bold text-white mb-6">Our Values</h3>
              <ul class="text-white/80 space-y-2">
                <li>• Quality without compromise</li>
                <li>• Innovation in technology and technique</li>
                <li>• Support for emerging artists</li>
                <li>• Sustainable business practices</li>
                <li>• Community and collaboration</li>
              </ul>
            </div>
          </div>

          <div class="mb-20">
            <h2 class="text-4xl font-bold text-white mb-12 text-center">Meet Our Team</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div class="flex items-start space-x-4">
                  <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-gray-600 text-xs">Photo</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-white mb-1">Marcus Weber</h3>
                    <p class="text-[#4fdce5] font-medium mb-3">Founder & Lead Engineer</p>
                    <p class="text-white/80 text-sm leading-relaxed mb-4">With over 15 years of experience in music production, Marcus has worked with artists across all genres. His passion for sound quality and attention to detail has made him one of Switzerland's most sought-after engineers.</p>
                    <div class="flex flex-wrap gap-2">
                      <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Recording</span>
                      <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Mixing</span>
                      <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Production</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div class="flex items-start space-x-4">
                  <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-gray-600 text-xs">Photo</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-white mb-1">Sophia Müller</h3>
                    <p class="text-[#4fdce5] font-medium mb-3">Studio Manager</p>
                    <p class="text-white/80 text-sm leading-relaxed mb-4">Sophia ensures the smooth operation of our studios and provides exceptional client support. Her organizational skills and friendly demeanor make every artist feel at home.</p>
                    <div class="flex flex-wrap gap-2">
                      <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Management</span>
                      <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Client Relations</span>
                      <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Scheduling</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-20">
            <h2 class="text-4xl font-bold text-white mb-8 text-center">Our Studio</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="text-center">
                <div class="text-4xl font-bold text-[#4fdce5] mb-2">2</div>
                <div class="text-white/80">Professional Studios</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-[#4fdce5] mb-2">24/7</div>
                <div class="text-white/80">Access Available</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-[#4fdce5] mb-2">State-of-the-Art</div>
                <div class="text-white/80">Equipment</div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <h3 class="text-3xl font-bold text-white mb-8">Ready to Work With Us?</h3>
            <p class="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're looking to record your next hit or develop your skills,
              we're here to help you achieve your musical goals.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact">
                <button class="px-10 py-4 bg-[#4fdce5] text-black font-semibold text-lg rounded-lg hover:bg-[#3cc9d3] hover:scale-105 transition-all duration-300">
                  Get in Touch
                </button>
              </a>
              <a href="/services">
                <button class="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                  View Services
                </button>
              </a>
            </div>
          </div>
        `,
        metaTitle: 'About Us - Zurich Musiq',
        metaDescription: 'Learn about Zurich Musiq, our team, and our commitment to professional music production.',
        isPublished: true,
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        content: `
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">Contact Us</h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Ready to start your next project? Get in touch with us to discuss your needs, 
              get a quote, or book studio time.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 class="text-3xl font-bold text-white mb-8">Send Us a Message</h2>
              <form class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-white text-sm font-medium mb-2">Name</label>
                    <input type="text" class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]" placeholder="Your name" />
                  </div>
                  <div>
                    <label class="block text-white text-sm font-medium mb-2">Email</label>
                    <input type="email" class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label class="block text-white text-sm font-medium mb-2">Phone</label>
                  <input type="tel" class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]" placeholder="+41 XX XXX XX XX" />
                </div>
                <div>
                  <label class="block text-white text-sm font-medium mb-2">Service Needed</label>
                  <select class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]">
                    <option>Recording</option>
                    <option>Mixing</option>
                    <option>Mastering</option>
                    <option>Production</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-white text-sm font-medium mb-2">Message</label>
                  <textarea rows="4" class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]" placeholder="Tell us about your project..."></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-white text-sm font-medium mb-2">Budget Range</label>
                    <select class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]">
                      <option>Under CHF 500</option>
                      <option>CHF 500 - 1,000</option>
                      <option>CHF 1,000 - 2,500</option>
                      <option>CHF 2,500 - 5,000</option>
                      <option>Over CHF 5,000</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-white text-sm font-medium mb-2">Timeline</label>
                    <select class="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]">
                      <option>ASAP</option>
                      <option>Within 1 week</option>
                      <option>Within 1 month</option>
                      <option>Within 3 months</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                </div>
                <button type="submit" class="w-full bg-[#4fdce5] hover:bg-[#3cc9d3] text-white font-bold py-3 px-4 rounded-lg transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            <div class="space-y-8">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 class="text-2xl font-bold text-white mb-6">Studio Information</h3>
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-[#4fdce5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span class="text-black text-xs font-bold">📍</span>
                    </div>
                    <div>
                      <p class="text-white font-medium">Address</p>
                      <p class="text-white/80">Bahnhofstrasse 123<br />8001 Zurich, Switzerland</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-[#4fdce5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span class="text-black text-xs font-bold">📞</span>
                    </div>
                    <div>
                      <p class="text-white font-medium">Phone</p>
                      <p class="text-white/80">+41 44 123 45 67</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-[#4fdce5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span class="text-black text-xs font-bold">✉️</span>
                    </div>
                    <div>
                      <p class="text-white font-medium">Email</p>
                      <p class="text-white/80">info@zurichmusiq.com</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <div class="w-6 h-6 bg-[#4fdce5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span class="text-black text-xs font-bold">🕒</span>
                    </div>
                    <div>
                      <p class="text-white font-medium">Hours</p>
                      <p class="text-white/80">Mon-Fri: 9:00 - 22:00<br />Sat-Sun: 10:00 - 20:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 class="text-2xl font-bold text-white mb-6">Quick Response</h3>
                <p class="text-white/80 mb-4">
                  We typically respond to all inquiries within 24 hours. For urgent bookings, 
                  please call us directly.
                </p>
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-[#4fdce5] rounded-full"></div>
                    <span class="text-white/80">Free consultation call</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-[#4fdce5] rounded-full"></div>
                    <span class="text-white/80">Custom project quotes</span>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-[#4fdce5] rounded-full"></div>
                    <span class="text-white/80">Flexible scheduling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        metaTitle: 'Contact Us - Zurich Musiq',
        metaDescription: 'Contact Zurich Musiq for studio bookings and music production inquiries.',
        isPublished: true,
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        slug: 'services',
        title: 'Our Services',
        content: `
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">Our Services</h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Professional music production, recording, and artist development services 
              to help you create, record, and succeed in the music industry.
            </p>
          </div>
        `,
        metaTitle: 'Our Services - Zurich Musiq',
        metaDescription: 'Professional music production services including recording, mixing, mastering, and production.',
        isPublished: true,
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        slug: 'music',
        title: 'Our Work',
        content: `
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">Our Work</h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover our portfolio of successful projects across various genres. 
              From intimate acoustic sessions to full orchestral recordings, we've helped artists bring their vision to life.
            </p>
          </div>
        `,
        metaTitle: 'Our Work - Zurich Musiq',
        metaDescription: 'Explore our portfolio of music production projects and collaborations.',
        isPublished: true,
        createdBy: 'System',
        updatedBy: 'System'
      },
      {
        slug: 'booking',
        title: 'Book Studio Time',
        content: `
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">Book Your Studio Time</h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Choose from our two professional recording studios, each equipped with state-of-the-art gear 
              and designed for exceptional sound quality. Book your session and start creating your masterpiece.
            </p>
          </div>
        `,
        metaTitle: 'Book Studio Time - Zurich Musiq',
        metaDescription: 'Book professional recording studio time at Zurich Musiq. Choose from our state-of-the-art studios.',
        isPublished: true,
        createdBy: 'System',
        updatedBy: 'System'
      }
    ]

    for (const page of pages) {
      await prisma.page.upsert({
        where: { slug: page.slug },
        update: page,
        create: page
      })
    }
    console.log('✅ Pages created successfully')

    // 2. Create Studios
    console.log('🏢 Creating studios...')
    const studios = [
      {
        id: 'studio-s',
        name: 'Studio S - Production Suite',
        description: 'A versatile production studio perfect for mixing, mastering, vocal recording, and electronic music production. Features a smaller, more intimate space with state-of-the-art digital tools and excellent acoustic treatment.',
        size: '80 m²',
        capacity: '2-4 people',
        hourlyRate: 120,
        dailyRate: 800,
        weeklyRate: 4000,
        features: ['Digital Mixing Console', 'Professional Monitors', 'Acoustic Treatment', 'Vocal Booth', 'Electronic Music Setup'],
        equipment: {
          console: 'SSL Matrix2',
          monitors: 'Genelec 8351B',
          microphones: ['Neumann U87', 'AKG C414', 'Shure SM7B'],
          instruments: ['MIDI Controller', 'Synthesizer', 'Drum Machine']
        },
        images: ['/STUDIO-S.png'],
        isActive: true
      },
      {
        id: 'studio-xl',
        name: 'Studio XL - Full Production Suite',
        description: 'Our flagship studio designed for full-band recordings, orchestral sessions, and large-scale productions. Features a spacious live room, multiple isolation booths, and a large control room with analog and digital mixing capabilities.',
        size: '150 m²',
        capacity: '8-12 people',
        hourlyRate: 200,
        dailyRate: 1400,
        weeklyRate: 7000,
        features: ['Analog Mixing Console', 'Large Live Room', 'Multiple Isolation Booths', 'Professional Monitors', 'Full Band Setup'],
        equipment: {
          console: 'SSL AWS 948',
          monitors: 'ATC SCM45A Pro',
          microphones: ['Neumann U87', 'AKG C414', 'Shure SM7B', 'Royer R-121', 'Coles 4038'],
          instruments: ['Grand Piano', 'Drum Kit', 'Guitar Amps', 'Bass Amps']
        },
        images: ['/STUDIO-XL.png'],
        isActive: true
      }
    ]

    for (const studio of studios) {
      await prisma.studio.upsert({
        where: { id: studio.id },
        update: studio,
        create: studio
      })
    }
    console.log('✅ Studios created successfully')

    // 3. Create Services
    console.log('🎵 Creating services...')
    const services = [
      {
        id: 'mixing-mastering',
        title: 'Mixing & Mastering',
        description: 'Get your projects professionally mixed and mastered by our experienced engineers, ensuring they are polished, balanced, and ready for release on any platform. We use industry-standard equipment and techniques to deliver broadcast-quality results.',
        features: [
          'Professional mixing on SSL consoles',
          'Mastering for all streaming platforms',
          'Reference track analysis',
          'Multiple format delivery',
          'Unlimited revisions'
        ],
        pricing: 'Starting from CHF 200 per song',
        duration: '3-5 days per song',
        isActive: true
      },
      {
        id: 'music-production',
        title: 'Music Production',
        description: 'Full-service music production from concept to completion. Our producers work closely with artists to develop their sound, arrange songs, and create professional recordings that stand out in today\'s competitive market.',
        features: [
          'Song arrangement and development',
          'Professional recording',
          'Instrument programming',
          'Vocal production',
          'Creative direction'
        ],
        pricing: 'Starting from CHF 500 per song',
        duration: '1-2 weeks per song',
        isActive: true
      },
      {
        id: 'professional-recording',
        title: 'Professional Recording',
        description: 'High-quality recording services in our state-of-the-art studios. Whether you need to record vocals, instruments, or full band sessions, our engineers will capture your performance with pristine quality.',
        features: [
          'Multi-track recording',
          'Professional microphones',
          'Acoustic treatment',
          'Real-time monitoring',
          'Backup recordings'
        ],
        pricing: 'Starting from CHF 120 per hour',
        duration: 'Flexible scheduling',
        isActive: true
      },
      {
        id: 'artist-development',
        title: 'Artist Development',
        description: 'Comprehensive artist development services to help emerging artists refine their sound, build their brand, and navigate the music industry. We provide guidance on everything from songwriting to marketing.',
        features: [
          'Songwriting workshops',
          'Performance coaching',
          'Industry networking',
          'Brand development',
          'Career planning'
        ],
        pricing: 'Starting from CHF 300 per session',
        duration: 'Ongoing support',
        isActive: true
      }
    ]

    for (const service of services) {
      await prisma.service.upsert({
        where: { id: service.id },
        update: service,
        create: service
      })
    }
    console.log('✅ Services created successfully')

    // 4. Create Projects
    console.log('🎤 Creating projects...')
    const projects = [
      {
        id: 'project-1',
        title: 'Midnight Dreams',
        artist: 'Luna Echo',
        genre: 'Alternative Pop',
        description: 'A hauntingly beautiful alternative pop album featuring ethereal vocals and atmospheric production. Recorded and mixed at Zurich Musiq.',
        services: ['Recording', 'Mixing', 'Mastering'],
        year: '2024',
        image: '/placeholder.jpg',
        isPublished: true
      },
      {
        id: 'project-2',
        title: 'Urban Rhythms',
        artist: 'City Beats Collective',
        genre: 'Hip-Hop',
        description: 'High-energy hip-hop tracks with innovative beats and powerful lyrics. Full production and mixing services.',
        services: ['Music Production', 'Mixing', 'Mastering'],
        year: '2024',
        image: '/placeholder.jpg',
        isPublished: true
      },
      {
        id: 'project-3',
        title: 'Classical Fusion',
        artist: 'Swiss Symphony',
        genre: 'Classical',
        description: 'Modern classical compositions with electronic elements. Orchestral recording and post-production.',
        services: ['Recording', 'Mixing', 'Mastering'],
        year: '2023',
        image: '/placeholder.jpg',
        isPublished: true
      },
      {
        id: 'project-4',
        title: 'Jazz Nights',
        artist: 'Zurich Jazz Quartet',
        genre: 'Jazz',
        description: 'Intimate jazz recordings capturing the essence of live performance. Natural acoustic recording.',
        services: ['Recording', 'Mixing'],
        year: '2023',
        image: '/placeholder.jpg',
        isPublished: true
      }
    ]

    for (const project of projects) {
      await prisma.project.upsert({
        where: { id: project.id },
        update: project,
        create: project
      })
    }
    console.log('✅ Projects created successfully')

    // 5. Create Admin User
    console.log('👤 Creating admin user...')
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@zurichmusiq.com' },
      update: {
        name: 'Admin User',
        role: 'SUPER_ADMIN'
      },
      create: {
        name: 'Admin User',
        email: 'admin@zurichmusiq.com',
        role: 'SUPER_ADMIN'
      }
    })
    console.log('✅ Admin user created successfully')

    // 6. Create Sample Bookings
    console.log('📅 Creating sample bookings...')
    const bookings = [
      {
        studioId: 'studio-s',
        userId: adminUser.id,
        date: new Date('2024-02-15'),
        startTime: '10:00',
        duration: 4,
        totalCost: 480,
        status: 'CONFIRMED',
        addons: ['Professional Engineer'],
        notes: 'Vocal recording session'
      },
      {
        studioId: 'studio-xl',
        userId: adminUser.id,
        date: new Date('2024-02-20'),
        startTime: '14:00',
        duration: 8,
        totalCost: 1600,
        status: 'PENDING',
        addons: ['Professional Engineer', 'Backup Recording'],
        notes: 'Full band recording'
      }
    ]

    for (const booking of bookings) {
      await prisma.booking.create({
        data: booking
      })
    }
    console.log('✅ Sample bookings created successfully')

    console.log('🎉 Migration completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- ${pages.length} pages created`)
    console.log(`- ${studios.length} studios created`)
    console.log(`- ${services.length} services created`)
    console.log(`- ${projects.length} projects created`)
    console.log(`- 1 admin user created`)
    console.log(`- ${bookings.length} sample bookings created`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
migrateMockData()
  .then(() => {
    console.log('✅ Migration script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error)
    process.exit(1)
  })
