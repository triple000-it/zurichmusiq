const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Migrating existing pages to database...')

  // Define the existing pages with their content
  const existingPages = [
    {
      id: 'home-page',
      slug: 'home',
      title: 'Home - Zurich Musiq',
      content: `
        <div class="hero-section">
          <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">
            Professional Music Production
          </h1>
          <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            Experience world-class recording, mixing, and mastering in our state-of-the-art studios. 
            From intimate acoustic sessions to full orchestral recordings, we bring your musical vision to life.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/booking" class="px-10 py-4 bg-[#4fdce5] text-black font-semibold text-lg rounded-lg hover:bg-[#3cc9d3] hover:scale-105 transition-all duration-300 text-center">
              Book Studio Time
            </a>
            <a href="/services" class="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-center">
              View Services
            </a>
          </div>
        </div>
        
        <section class="relative z-20 w-full px-8 lg:px-16 mt-20">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center">
                <div class="text-4xl lg:text-5xl font-bold text-[#4fdce5] mb-2">2</div>
                <div class="text-lg text-gray-300">Professional Studios</div>
              </div>
              <div class="text-center">
                <div class="text-4xl lg:text-5xl font-bold text-[#4fdce5] mb-2">1000+</div>
                <div class="text-lg text-gray-300">Songs Recorded</div>
              </div>
              <div class="text-center">
                <div class="text-4xl lg:text-5xl font-bold text-[#4fdce5] mb-2">15+</div>
                <div class="text-lg text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>
        </section>
      `,
      metaTitle: 'Zurich Musiq - Professional Music Production Studio',
      metaDescription: 'Professional music production, recording, mixing and mastering services in Zurich. State-of-the-art studios for artists and musicians.',
      isPublished: true
    },
    {
      id: 'about-page',
      slug: 'about',
      title: 'About Us - Zurich Musiq',
      content: `
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-8 text-center">
            About Zurich Musiq
          </h1>
          <div class="prose prose-lg prose-invert max-w-none">
            <p class="text-xl text-white/80 mb-8 leading-relaxed">
              At Zurich Musiq, we are passionate about music and dedicated to helping artists achieve their creative vision. 
              With over 15 years of experience in the music industry, we have built a reputation for excellence in 
              professional music production.
            </p>
            <p class="text-xl text-white/80 mb-8 leading-relaxed">
              Our state-of-the-art facilities feature two professional recording studios equipped with the latest 
              technology and vintage gear. From intimate acoustic sessions to full orchestral recordings, 
              we provide the perfect environment for any musical project.
            </p>
            <h2 class="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p class="text-xl text-white/80 mb-8 leading-relaxed">
              To provide world-class music production services while fostering creativity and supporting 
              artists in bringing their musical visions to life. We believe every artist deserves access 
              to professional-quality recording and production services.
            </p>
            <h2 class="text-3xl font-bold text-white mb-6">Why Choose Us</h2>
            <ul class="text-xl text-white/80 mb-8 leading-relaxed space-y-4">
              <li>• Professional-grade equipment and acoustically treated rooms</li>
              <li>• Experienced engineers and producers</li>
              <li>• Flexible booking options and competitive rates</li>
              <li>• Full-service production from recording to mastering</li>
              <li>• Support for all musical genres and styles</li>
            </ul>
          </div>
        </div>
      `,
      metaTitle: 'About Zurich Musiq - Professional Music Production',
      metaDescription: 'Learn about Zurich Musiq\'s mission, facilities, and commitment to professional music production services.',
      isPublished: true
    },
    {
      id: 'music-page',
      slug: 'music',
      title: 'Our Work - Zurich Musiq',
      content: `
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">
              Our Work
            </h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover our portfolio of successful projects across various genres.
              From intimate acoustic sessions to full orchestral recordings, we've helped artists bring their vision to life.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div class="aspect-square bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                <span class="text-gray-600 text-sm">Project Image</span>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Midnight Dreams</h3>
              <p class="text-[#4fdce5] font-medium mb-1">Luna Echo</p>
              <p class="text-white/60 text-sm mb-2">Alternative Pop • 2024</p>
              <p class="text-white/80 text-sm mb-4 leading-relaxed">
                A full-length album featuring 12 tracks of atmospheric pop with electronic elements.
              </p>
              <div class="mb-4">
                <h4 class="text-white font-medium mb-2">Services Provided:</h4>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Music Production</span>
                  <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Recording</span>
                  <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Mixing</span>
                  <span class="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">Mastering</span>
                </div>
              </div>
              <button class="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300">
                View Details
              </button>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-20">
            <h2 class="text-3xl font-bold text-white text-center mb-8">
              Studio Statistics
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div class="text-4xl font-bold text-[#4fdce5] mb-2">150+</div>
                <div class="text-white/80">Projects Completed</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-[#4fdce5] mb-2">25+</div>
                <div class="text-white/80">Artists Worked With</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-[#4fdce5] mb-2">98%</div>
                <div class="text-white/80">Client Satisfaction</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-[#4fdce5] mb-2">5+</div>
                <div class="text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      `,
      metaTitle: 'Our Work - Zurich Musiq Portfolio',
      metaDescription: 'Explore Zurich Musiq\'s portfolio of successful music production projects and studio statistics.',
      isPublished: true
    },
    {
      id: 'services-page',
      slug: 'services',
      title: 'Services - Zurich Musiq',
      content: `
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">
              Our Services
            </h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Professional music production services tailored to your needs. 
              From recording to mastering, we provide comprehensive solutions for artists and musicians.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div class="w-16 h-16 bg-[#4fdce5] rounded-lg flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Professional Recording</h3>
              <p class="text-white/80 mb-6 leading-relaxed">
                State-of-the-art recording facilities with professional-grade equipment and acoustically treated rooms.
              </p>
              <ul class="text-white/70 space-y-2 mb-6">
                <li>• Multi-track recording</li>
                <li>• Live room and isolation booths</li>
                <li>• Professional microphones and preamps</li>
                <li>• Real-time monitoring</li>
              </ul>
              <div class="text-[#4fdce5] font-semibold">Starting from €120/hour</div>
            </div>

            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div class="w-16 h-16 bg-[#4fdce5] rounded-lg flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Mixing & Mastering</h3>
              <p class="text-white/80 mb-6 leading-relaxed">
                Professional mixing and mastering services to bring your recordings to life with clarity and impact.
              </p>
              <ul class="text-white/70 space-y-2 mb-6">
                <li>• Multi-track mixing</li>
                <li>• Stereo mastering</li>
                <li>• Reference track analysis</li>
                <li>• Multiple format delivery</li>
              </ul>
              <div class="text-[#4fdce5] font-semibold">Starting from €150/track</div>
            </div>

            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
              <div class="w-16 h-16 bg-[#4fdce5] rounded-lg flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Music Production</h3>
              <p class="text-white/80 mb-6 leading-relaxed">
                Full-service music production from concept to completion, including arrangement and creative direction.
              </p>
              <ul class="text-white/70 space-y-2 mb-6">
                <li>• Song arrangement</li>
                <li>• Creative direction</li>
                <li>• Instrumentation</li>
                <li>• Project management</li>
              </ul>
              <div class="text-[#4fdce5] font-semibold">Starting from €500/day</div>
            </div>
          </div>
        </div>
      `,
      metaTitle: 'Services - Zurich Musiq Music Production',
      metaDescription: 'Professional music production services including recording, mixing, mastering, and full production services.',
      isPublished: true
    },
    {
      id: 'contact-page',
      slug: 'contact',
      title: 'Contact - Zurich Musiq',
      content: `
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-20">
            <h1 class="text-6xl md:text-7xl font-bold text-white mb-8">
              Contact Us
            </h1>
            <p class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Ready to start your next project? Get in touch with us to discuss your musical vision 
              and how we can help bring it to life.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 class="text-3xl font-bold text-white mb-8">Get In Touch</h2>
              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-[#4fdce5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-white mb-2">Email</h3>
                    <p class="text-white/80">info@zurichmusiq.com</p>
                    <p class="text-white/60 text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-[#4fdce5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-white mb-2">Phone</h3>
                    <p class="text-white/80">+41 44 123 4567</p>
                    <p class="text-white/60 text-sm">Mon-Fri 9AM-6PM</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 bg-[#4fdce5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-white mb-2">Address</h3>
                    <p class="text-white/80">Music Street 123<br>8001 Zurich, Switzerland</p>
                    <p class="text-white/60 text-sm">Easy access by public transport</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 class="text-2xl font-bold text-white mb-6">Send us a message</h3>
              <form class="space-y-6">
                <div>
                  <label class="block text-white/80 text-sm font-medium mb-2">Name</label>
                  <input type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#4fdce5] focus:border-transparent" placeholder="Your name">
                </div>
                <div>
                  <label class="block text-white/80 text-sm font-medium mb-2">Email</label>
                  <input type="email" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#4fdce5] focus:border-transparent" placeholder="your@email.com">
                </div>
                <div>
                  <label class="block text-white/80 text-sm font-medium mb-2">Project Type</label>
                  <select class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#4fdce5] focus:border-transparent">
                    <option>Recording</option>
                    <option>Mixing & Mastering</option>
                    <option>Music Production</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-white/80 text-sm font-medium mb-2">Message</label>
                  <textarea rows="4" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-[#4fdce5] focus:border-transparent" placeholder="Tell us about your project..."></textarea>
                </div>
                <button type="submit" class="w-full px-6 py-3 bg-[#4fdce5] text-black font-semibold rounded-lg hover:bg-[#3cc9d3] transition-colors duration-300">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      `,
      metaTitle: 'Contact - Zurich Musiq Music Studio',
      metaDescription: 'Contact Zurich Musiq for professional music production services. Get in touch to discuss your project.',
      isPublished: true
    }
  ]

  // Create pages in database
  for (const pageData of existingPages) {
    try {
      // Check if page already exists
      const existingPage = await prisma.page.findUnique({
        where: { slug: pageData.slug }
      })

      if (existingPage) {
        console.log(`✅ Page "${pageData.title}" already exists, updating...`)
        await prisma.page.update({
          where: { slug: pageData.slug },
          data: {
            title: pageData.title,
            content: pageData.content,
            metaTitle: pageData.metaTitle,
            metaDescription: pageData.metaDescription,
            isPublished: pageData.isPublished,
            updatedBy: 'System Migration',
            updatedAt: new Date()
          }
        })
      } else {
        console.log(`✅ Creating page "${pageData.title}"...`)
        await prisma.page.create({
          data: {
            ...pageData,
            createdBy: 'System Migration',
            updatedBy: 'System Migration'
          }
        })
      }
    } catch (error) {
      console.error(`❌ Error with page "${pageData.title}":`, error)
    }
  }

  console.log('🎉 Page migration completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error migrating pages:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
