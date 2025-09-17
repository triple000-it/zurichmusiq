const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const pages = [
  {
    slug: 'home',
    title: 'Home - Zurich Musiq',
    content: `
      <section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Welcome to Zurich Musiq</h1>
        <p style="font-size: 1.2rem; margin-bottom: 30px;">Professional music production studio in the heart of Zurich</p>
        <button style="background: #4fdce5; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Get Started</button>
      </section>
      
      <section class="features-section" style="padding: 60px 20px; background: #f8f9fa; margin: 20px 0; border-radius: 10px;">
        <h2 style="text-align: center; margin-bottom: 50px; font-size: 2.5rem; color: #2c3e50;">Our Services</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #4fdce5; margin-bottom: 15px;">Music Production</h3>
            <p>Professional music production services</p>
          </div>
          <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #4fdce5; margin-bottom: 15px;">Mixing & Mastering</h3>
            <p>High-quality audio mixing and mastering</p>
          </div>
          <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <h3 style="color: #4fdce5; margin-bottom: 15px;">Studio Rentals</h3>
            <p>Professional studio space for rent</p>
          </div>
        </div>
      </section>
    `,
    metaTitle: 'Home - Zurich Musiq | Professional Music Production Studio',
    metaDescription: 'Zurich Musiq is a professional music production studio in Zurich, Switzerland. We offer music production, mixing, mastering, and studio rental services.',
    isPublished: true,
    createdBy: 'System Migration',
    updatedBy: 'System Migration'
  },
  {
    slug: 'about',
    title: 'About Us - Zurich Musiq',
    content: `
      <section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">About Zurich Musiq</h1>
        <p style="font-size: 1.2rem; margin-bottom: 30px;">Your trusted partner in music production</p>
      </section>
      
      <section class="about-content" style="padding: 60px 20px; max-width: 1200px; margin: 0 auto;">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 style="font-size: 2.5rem; color: #2c3e50; margin-bottom: 30px;">Our Story</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #666; margin-bottom: 20px;">
              Founded in 2008, Zurich Musiq has been at the forefront of music production in Switzerland. 
              We combine cutting-edge technology with artistic vision to help artists bring their musical dreams to life.
            </p>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #666; margin-bottom: 20px;">
              Our state-of-the-art facilities and experienced team have worked with artists across all genres, 
              from emerging talents to established professionals.
            </p>
          </div>
          <div>
            <h2 style="font-size: 2.5rem; color: #2c3e50; margin-bottom: 30px;">Why Choose Us</h2>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <span style="color: #4fdce5; margin-right: 15px; font-size: 1.5rem;">✓</span>
                <span>15+ years of experience</span>
              </li>
              <li style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <span style="color: #4fdce5; margin-right: 15px; font-size: 1.5rem;">✓</span>
                <span>Professional equipment</span>
              </li>
              <li style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <span style="color: #4fdce5; margin-right: 15px; font-size: 1.5rem;">✓</span>
                <span>Flexible scheduling</span>
              </li>
              <li style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <span style="color: #4fdce5; margin-right: 15px; font-size: 1.5rem;">✓</span>
                <span>Competitive pricing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    `,
    metaTitle: 'About Us - Zurich Musiq | Music Production Studio',
    metaDescription: 'Learn about Zurich Musiq, a professional music production studio in Zurich with 15+ years of experience. Discover our story and why artists choose us.',
    isPublished: true,
    createdBy: 'System Migration',
    updatedBy: 'System Migration'
  },
  {
    slug: 'services',
    title: 'Services - Zurich Musiq',
    content: `
      <section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Our Services</h1>
        <p style="font-size: 1.2rem; margin-bottom: 30px;">Professional music production services tailored to your needs</p>
      </section>
      
      <section class="services-grid" style="padding: 60px 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px;">
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #4fdce5; font-size: 1.8rem; margin-bottom: 20px;">Music Production</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Full-service music production from concept to completion. We work with you to create professional-quality tracks.
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <strong>Starting from €500</strong>
            </div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #4fdce5; font-size: 1.8rem; margin-bottom: 20px;">Mixing & Mastering</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Professional audio mixing and mastering services to make your music sound radio-ready.
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <strong>Starting from €200</strong>
            </div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
            <h3 style="color: #4fdce5; font-size: 1.8rem; margin-bottom: 20px;">Studio Rentals</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Rent our professional studio space with state-of-the-art equipment for your recording sessions.
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <strong>€50/hour</strong>
            </div>
          </div>
        </div>
      </section>
    `,
    metaTitle: 'Services - Zurich Musiq | Music Production Services',
    metaDescription: 'Discover our professional music production services including music production, mixing, mastering, and studio rentals in Zurich.',
    isPublished: true,
    createdBy: 'System Migration',
    updatedBy: 'System Migration'
  },
  {
    slug: 'music',
    title: 'Our Work - Zurich Musiq',
    content: `
      <section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Our Work</h1>
        <p style="font-size: 1.2rem; margin-bottom: 30px;">Explore our portfolio of music production projects</p>
      </section>
      
      <section class="portfolio-grid" style="padding: 60px 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="height: 200px; background: linear-gradient(45deg, #4fdce5, #3cc9d3); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
              Project 1
            </div>
            <div style="padding: 20px;">
              <h3 style="color: #2c3e50; margin-bottom: 10px;">Electronic Album</h3>
              <p style="color: #666; font-size: 0.9rem;">Full album production and mastering</p>
            </div>
          </div>
          
          <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="height: 200px; background: linear-gradient(45deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
              Project 2
            </div>
            <div style="padding: 20px;">
              <h3 style="color: #2c3e50; margin-bottom: 10px;">Hip-Hop EP</h3>
              <p style="color: #666; font-size: 0.9rem;">Mixing and mastering services</p>
            </div>
          </div>
          
          <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="height: 200px; background: linear-gradient(45deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
              Project 3
            </div>
            <div style="padding: 20px;">
              <h3 style="color: #2c3e50; margin-bottom: 10px;">Pop Single</h3>
              <p style="color: #666; font-size: 0.9rem;">Complete production from scratch</p>
            </div>
          </div>
        </div>
      </section>
    `,
    metaTitle: 'Our Work - Zurich Musiq | Music Production Portfolio',
    metaDescription: 'View our portfolio of music production projects including albums, EPs, and singles across various genres.',
    isPublished: true,
    createdBy: 'System Migration',
    updatedBy: 'System Migration'
  },
  {
    slug: 'contact',
    title: 'Contact - Zurich Musiq',
    content: `
      <section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
        <h1 style="font-size: 3rem; margin-bottom: 20px;">Contact Us</h1>
        <p style="font-size: 1.2rem; margin-bottom: 30px;">Ready to start your next project? Get in touch with us today.</p>
      </section>
      
      <section class="contact-content" style="padding: 60px 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 40px;">
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-bottom: 30px; font-size: 2rem;">Get in Touch</h2>
            <div style="space-y: 20px;">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 20px; height: 20px; background: #4fdce5; border-radius: 50%; margin-right: 15px;"></div>
                <div>
                  <p style="font-weight: bold; color: #2c3e50;">Email</p>
                  <a href="mailto:hello@zurichmusiq.com" style="color: #4fdce5; text-decoration: none;">hello@zurichmusiq.com</a>
                </div>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 20px; height: 20px; background: #4fdce5; border-radius: 50%; margin-right: 15px;"></div>
                <div>
                  <p style="font-weight: bold; color: #2c3e50;">Phone</p>
                  <a href="tel:+41441234567" style="color: #4fdce5; text-decoration: none;">+41 44 123 45 67</a>
                </div>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 20px; height: 20px; background: #4fdce5; border-radius: 50%; margin-right: 15px;"></div>
                <div>
                  <p style="font-weight: bold; color: #2c3e50;">Address</p>
                  <p style="color: #666;">Bahnhofstrasse 123<br>8001 Zürich, Switzerland</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-bottom: 30px; font-size: 2rem;">Studio Hours</h2>
            <div style="space-y: 10px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="color: #2c3e50;">Monday - Friday</span>
                <span style="color: #666;">9:00 AM - 10:00 PM</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="color: #2c3e50;">Saturday</span>
                <span style="color: #666;">10:00 AM - 8:00 PM</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="color: #2c3e50;">Sunday</span>
                <span style="color: #666;">12:00 PM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    metaTitle: 'Contact - Zurich Musiq | Get in Touch',
    metaDescription: 'Contact Zurich Musiq for professional music production services. Get in touch to discuss your project and get a quote.',
    isPublished: true,
    createdBy: 'System Migration',
    updatedBy: 'System Migration'
  }
]

async function main() {
  console.log('Starting to populate pages...')
  
  for (const page of pages) {
    try {
      // Check if page already exists
      const existingPage = await prisma.page.findUnique({
        where: { slug: page.slug }
      })
      
      if (existingPage) {
        console.log(`Page ${page.slug} already exists, updating...`)
        await prisma.page.update({
          where: { slug: page.slug },
          data: page
        })
      } else {
        console.log(`Creating page ${page.slug}...`)
        await prisma.page.create({
          data: page
        })
      }
    } catch (error) {
      console.error(`Error processing page ${page.slug}:`, error)
    }
  }
  
  console.log('Pages populated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
