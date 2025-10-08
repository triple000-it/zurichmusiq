"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ShaderBackground from "@/components/shader-background"
import PulsingCircle from "@/components/pulsing-circle"
import SimpleInlineEditor from "@/components/simple-inline-editor"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    budget: "",
    timeline: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      alert('Please fill in all required fields')
      return
    }

    try {
      // Here you would typically send the form data to your backend
      console.log("Form submitted:", formData)
      
      // For now, just show a success message
      alert('Thank you for your message! We\'ll get back to you within 24 hours.')
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        budget: "",
        timeline: ""
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error sending your message. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <ShaderBackground>
      <Header />
      
      {/* Simple Inline Editor */}
      <SimpleInlineEditor pageSlug="contact" pageTitle="Contact Us" />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">Contact Us</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Ready to start your next project? Get in touch with us to discuss your needs, 
              get a quote, or book studio time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-8">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-white font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                      placeholder="+41 XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-white font-medium mb-2">Service Interest *</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60"
                    >
                      <option value="">Select a service</option>
                      <option value="mixing-mastering">Mixing & Mastering</option>
                      <option value="music-production">Music Production</option>
                      <option value="artist-development">Artist Development</option>
                      <option value="courses">Producer Courses</option>
                      <option value="studio-rentals">Studio Rentals</option>
                      <option value="branding-marketing">Branding & Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget" className="block text-white font-medium mb-2">Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-500">Under € 500,00</option>
                      <option value="500-1000">€ 500,00 - 1.000,00</option>
                      <option value="1000-2500">€ 1.000,00 - 2.500,00</option>
                      <option value="2500-5000">€ 2.500,00 - 5.000,00</option>
                      <option value="over-5000">Over € 5.000,00</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-white font-medium mb-2">Timeline</label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">As soon as possible</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="1-month">1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">Project Details *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"
                    placeholder="Tell us about your project, goals, and any specific requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#4fdce5] text-black font-semibold text-lg rounded-lg hover:bg-[#3cc9d3] hover:scale-105 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column - Studio Information and Studio Hours */}
            <div className="space-y-8">
              {/* Studio Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Information</h3>
                <div className="space-y-4 text-white/80">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-[#4fdce5] rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium">Zurich Musiq</p>
                      <p>Rotterdam</p>
                      <p>The Netherlands</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-[#4fdce5] rounded-full"></div>
                    <div>
                      <p className="font-medium">E-mail</p>
                      <a href="mailto:info@zurichmusiq.com" className="text-[#4fdce5] hover:text-[#6ee7f0]">
                        info@zurichmusiq.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-[#4fdce5] rounded-full"></div>
                    <div>
                      <p className="font-medium">Phone & WhatsApp</p>
                      <a href="tel:+41441234567" className="text-[#4fdce5] hover:text-[#6ee7f0]">
                        +316XXXXXXXX
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Studio Hours */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Studio Hours</h3>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>12:00 PM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24/7 Access</span>
                    <span>Available for members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <PulsingCircle />
    </ShaderBackground>
  )
}