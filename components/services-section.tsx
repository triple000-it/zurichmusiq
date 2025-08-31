"use client"

import { useState } from "react"

interface Service {
  id: string
  title: string
  description: string
  features: string[]
}

const services: Service[] = [
  {
    id: "mixing-mastering",
    title: "Mixing & Mastering",
    description: "Get your projects professionally mixed and mastered by our experienced engineers, ensuring they are polished, balanced, and ready for release on any platform.",
    features: [
      "Professional mixing for all genres",
      "Industry-standard mastering",
      "Multiple format delivery",
      "Revision rounds included",
      "Reference track analysis"
    ]
  },
  {
    id: "music-production",
    title: "Music Production & Engineering",
    description: "Work with top-tier producers and engineers on projects ranging from singles to full albums. We bring your musical vision to life with cutting-edge technology and creative expertise.",
    features: [
      "Full album production",
      "Beat making and arrangement",
      "Vocal production",
      "Instrument recording",
      "Creative direction and guidance"
    ]
  },
  {
    id: "artist-development",
    title: "Artist Development",
    description: "Personalised coaching sessions designed to help artists find their sound and grow their careers. Perfect to unlock your full potential and navigate the music industry.",
    features: [
      "One-on-one coaching sessions",
      "Career strategy planning",
      "Performance development",
      "Industry networking guidance",
      "Brand identity development"
    ]
  },
  {
    id: "courses",
    title: "Producer & Engineering Courses",
    description: "Learn the skills to produce beats and professional engineering through hands-on training with our experienced team. Perfect for those wanting to take control of their own production or start a new career in the industry.",
    features: [
      "Hands-on practical training",
      "Industry-standard software training",
      "Mixing and mastering techniques",
      "Music theory fundamentals",
      "Portfolio building projects"
    ]
  },
  {
    id: "studio-rentals",
    title: "Studio Rentals",
    description: "Our fully equipped studios are Plug & Play and are available for rent, providing the perfect environment to bring your sounds to life. We also offer the option to include a professional engineer, ensuring you have the best support and experience during your session.",
    features: [
      "Professional recording equipment",
      "Multiple studio configurations",
      "Engineer assistance available",
      "Flexible booking options",
      "Competitive hourly rates"
    ]
  },
  {
    id: "branding-marketing",
    title: "Branding & Marketing",
    description: "We help artists develop their personal brand and connect with their audience. Manage projects, and navigate the complexities of the music business with strategic marketing and branding support.",
    features: [
      "Brand identity development",
      "Social media strategy",
      "Press kit creation",
      "Release campaign planning",
      "Industry relationship building"
    ]
  }
]

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service>(services[0])

  return (
    <section className="relative z-20 w-full py-20 px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-16 italic">
          OUR SERVICES
        </h2>

        {/* Service Categories Menu */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                selectedService.id === service.id
                  ? "bg-gray-200 text-blue-900 font-semibold border border-white"
                  : "text-white hover:text-blue-300"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        {/* Service Description Box */}
        <div className="bg-gray-200 rounded-lg p-8 border border-white">
          <h3 className="text-3xl font-bold text-blue-900 mb-6">
            {selectedService.title}
          </h3>
          <p className="text-gray-800 text-lg leading-relaxed mb-8">
            {selectedService.description}
          </p>
          
          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedService.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
