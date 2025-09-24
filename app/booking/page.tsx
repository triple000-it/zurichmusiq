"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ShaderBackground from "@/components/shader-background"
import Link from "next/link"
import Image from "next/image"
import PulsingCircle from "@/components/pulsing-circle"
import InlineEditor from "@/components/inline-editor"

interface Studio {
  id: string
  name: string
  description: string
  size: string
  capacity: string
  hourlyRate: number
  dailyRate: number
  weeklyRate: number
  features: string[]
  equipment: {
    category: string
    items: string[]
  }[]
  images: string[]
  availability: string
}

const studios: Studio[] = [
  {
    id: "studio-s",
    name: "Studio S - Production Suite",
    description: "A versatile production studio perfect for mixing, mastering, vocal recording, and electronic music production. Features a smaller, more intimate space with state-of-the-art digital tools and excellent acoustic treatment.",
    size: "80 m²",
    capacity: "Up to 6 musicians",
    hourlyRate: 80,
    dailyRate: 500,
    weeklyRate: 2500,
    features: [
      "Intimate recording space",
      "2 isolation booths",
      "Modern digital workflow",
      "Excellent acoustic treatment",
      "Professional monitoring",
      "Flexible booking options"
    ],
    equipment: [
      {
        category: "Microphones",
        items: [
          "Neumann TLM 103",
          "Shure SM7B",
          "AKG C214",
          "Sennheiser e906",
          "Rode NT1",
          "Various dynamic mics"
        ]
      },
      {
        category: "Preamps & Processing",
        items: [
          "Focusrite ISA Two",
          "Universal Audio Apollo Twin",
          "Warm Audio WA12 (x2)",
          "Arturia AudioFuse",
          "Various plugin bundles"
        ]
      },
      {
        category: "Digital & Software",
        items: [
          "Pro Tools Studio",
          "Logic Pro X",
          "Ableton Live Suite",
          "iZotope RX 10",
          "Waves Mercury Bundle",
          "Native Instruments Komplete"
        ]
      },
      {
        category: "Monitoring",
        items: [
          "Adam A7X monitors",
          "Sennheiser HD600 headphones",
          "Focusrite Scarlett interface",
          "Various MIDI controllers"
        ]
      }
    ],
    images: ["/STUDIO-S.png"],
    availability: "Available 7 days/week, 9 AM - 10 PM"
  },
  {
    id: "studio-xl",
    name: "Studio XL - Main Recording Suite",
    description: "Our flagship recording studio featuring a large live room with high ceilings, perfect for full band recordings, orchestral sessions, and acoustic projects. This studio is equipped with premium analog and digital gear for professional-grade recordings.",
    size: "120 m²",
    capacity: "Up to 12 musicians",
    hourlyRate: 120,
    dailyRate: 800,
    weeklyRate: 4000,
    features: [
      "Large live room with 4m ceilings",
      "3 isolation booths",
      "Control room with SSL console",
      "Natural acoustic treatment",
      "Professional monitoring system",
      "24/7 access for members"
    ],
    equipment: [
      {
        category: "Microphones",
        items: [
          "Neumann U87 (x2)",
          "Neumann U67",
          "Shure SM7B (x3)",
          "Sennheiser MD 421 (x4)",
          "AKG C414 (x2)",
          "Royer R-121 (x2)"
        ]
      },
      {
        category: "Preamps & Processing",
        items: [
          "Neve 1073 (x8)",
          "API 512c (x4)",
          "Universal Audio LA-2A",
          "Universal Audio 1176",
          "Empirical Labs Distressor (x2)",
          "Manley Voxbox"
        ]
      },
      {
        category: "Console & Monitoring",
        items: [
          "SSL Duality Delta SuperAnalogue Console",
          "Pro Tools HDX system",
          "Avid S6 control surface",
          "Barefoot Sound MM27 monitors",
          "Yamaha NS10M monitors",
          "Sennheiser HD650 headphones (x6)"
        ]
      },
      {
        category: "Instruments & Amps",
        items: [
          "Fender Rhodes Mark I",
          "Hammond B3 with Leslie 122",
          "Fender Twin Reverb",
          "Marshall JCM800",
          "Vox AC30",
          "Various guitars and basses"
        ]
      }
    ],
    images: ["/STUDIO-XL.png"],
    availability: "Available 7 days/week, 9 AM - 10 PM"
  }
]

const addonServices = [
  {
    name: "Professional Engineer",
    description: "Experienced recording engineer to assist with your session",
    hourlyRate: 60,
    dailyRate: 400
  },
  {
    name: "Producer Services",
    description: "Creative and technical guidance for your project",
    hourlyRate: 80,
    dailyRate: 500
  },
  {
    name: "Additional Equipment",
    description: "Extra microphones, instruments, or specialized gear",
    hourlyRate: 20,
    dailyRate: 120
  },
  {
    name: "Mixing & Mastering",
    description: "Post-production services for your recordings",
    hourlyRate: 100,
    dailyRate: 600
  }
]

export default function BookingPage() {
  const [selectedStudio, setSelectedStudio] = useState<Studio>(studios[0])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("4")
  const [addons, setAddons] = useState<string[]>([])

  const calculateTotal = () => {
    const baseRate = selectedStudio.hourlyRate * parseInt(duration)
    const addonCost = addons.reduce((total, addon) => {
      const service = addonServices.find(s => s.name === addon)
      return total + (service ? service.hourlyRate * parseInt(duration) : 0)
    }, 0)
    return baseRate + addonCost
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", {
      studio: selectedStudio.name,
      date: selectedDate,
      time: selectedTime,
      duration,
      addons,
      total: calculateTotal()
    })
  }

  return (
    <ShaderBackground>
      <Header />
      
      {/* Inline Editor */}
      <InlineEditor pageSlug="booking" pageTitle="Book Studio Time" />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
              Book Your Studio Time
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Choose from our two professional recording studios, each equipped with state-of-the-art gear 
              and designed for exceptional sound quality. Book your session and start creating your masterpiece.
            </p>
          </div>

          {/* Studio Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {studios.map((studio) => (
              <div
                key={studio.id}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer ${
                  selectedStudio.id === studio.id
                    ? "border-[#4fdce5] bg-white/15"
                    : "border-white/20 hover:border-white/40"
                }`}
                onClick={() => setSelectedStudio(studio)}
              >
                {/* Studio Image */}
                <div className="mb-6">
                  <Image
                    src={studio.images[0]}
                    alt={studio.name}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2">{studio.name}</h3>
                  <p className="text-[#4fdce5] text-lg">{studio.size} • {studio.capacity}</p>
                </div>
                
                <p className="text-white/80 text-center mb-6 leading-relaxed">
                  {studio.description}
                </p>

                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#4fdce5]">€ {studio.hourlyRate},00</div>
                    <div className="text-white/60 text-sm">per hour</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#4fdce5]">€ {studio.dailyRate},00</div>
                    <div className="text-white/60 text-sm">per day</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#4fdce5]">€ {studio.weeklyRate},00</div>
                    <div className="text-white/60 text-sm">per week</div>
                  </div>
                </div>

                <div className="text-center">
                  <button className="px-6 py-2 bg-[#5A9BB8] text-white rounded-lg hover:bg-[#4A8AA5] transition-colors duration-300">
                    Select Studio
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Studio Details & Booking Form */}
          <div className="space-y-8">
            {/* Studio Details */}
            <div className="space-y-8">
              {/* Features */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Studio Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStudio.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#4fdce5] rounded-full"></div>
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Equipment & Gear</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedStudio.equipment.map((category, index) => (
                    <div key={index}>
                      <h4 className="text-lg font-semibold text-[#4fdce5] mb-3">{category.category}</h4>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-white/70 text-sm">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Form - Full Width */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Book Your Session</h3>
              
              <form onSubmit={handleBooking} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Date & Time */}
                  <div>
                    <label className="block text-white font-medium mb-2">Date *</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Start Time *</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Duration (hours) *</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60"
                  >
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours (full day)</option>
                  </select>
                </div>

                {/* Add-on Services */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Additional Services</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addonServices.map((service) => (
                      <label key={service.name} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addons.includes(service.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAddons([...addons, service.name])
                            } else {
                              setAddons(addons.filter(a => a !== service.name))
                            }
                          }}
                          className="w-4 h-4 text-[#4fdce5] bg-white/20 border-white/30 rounded focus:ring-[#4fdce5]"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">{service.name}</div>
                          <div className="text-white/60 text-sm">{service.description}</div>
                          <div className="text-[#4fdce5] text-sm">€ {service.hourlyRate},00/hour</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Total Cost */}
                <div className="bg-white/10 rounded-lg p-4 border border-white/20 mb-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-white font-medium">Total Cost:</span>
                    <span className="text-2xl font-bold text-[#4fdce5]">€ {calculateTotal()},00</span>
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    {duration} hours × € {selectedStudio.hourlyRate},00/hour
                    {addons.length > 0 && ` + add-ons`}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-[#5A9BB8] to-[#6BAAC7] text-white font-semibold text-lg rounded-lg hover:scale-105 transition-all duration-300"
                >
                  Book Studio Time
                </button>
              </form>

              {/* Contact Info */}
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm mb-2">Need help with your booking?</p>
                <Link href="/contact">
                  <button className="text-[#4fdce5] hover:text-[#6ee7f0] text-sm underline">
                    Contact our team
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Complete Pricing Guide</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-white font-semibold text-lg pb-4">Service</th>
                    <th className="text-white font-semibold text-lg pb-4 text-center">Studio S</th>
                    <th className="text-white font-semibold text-lg pb-4 text-center">Studio XL</th>
                    <th className="text-white font-semibold text-lg pb-4 text-center">Add-ons</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  <tr>
                    <td className="text-white/80 py-3">Hourly Rate</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 80,00</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 120,00</td>
                    <td className="text-white/60 text-center">-</td>
                  </tr>
                  <tr>
                    <td className="text-white/80 py-3">Daily Rate (8 hours)</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 500,00</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 800,00</td>
                    <td className="text-white/60 text-center">-</td>
                  </tr>
                  <tr>
                    <td className="text-white/80 py-3">Weekly Rate</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 2.500,00</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 4.000,00</td>
                    <td className="text-white/60 text-center">-</td>
                  </tr>
                  <tr className="border-t border-white/20">
                    <td className="text-white/80 py-3">Professional Engineer</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 60,00/hour</td>
                  </tr>
                  <tr>
                    <td className="text-white/80 py-3">Producer Services</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 80,00/hour</td>
                  </tr>
                  <tr>
                    <td className="text-white/80 py-3">Additional Equipment</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 20,00/hour</td>
                  </tr>
                  <tr>
                    <td className="text-white/80 py-3">Mixing & Mastering</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-white/60 text-center">-</td>
                    <td className="text-[#4fdce5] font-bold text-center">€ 100,00/hour</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-white mb-8">
              Ready to Book Your Studio Time?
            </h3>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Choose your preferred studio, select your time slot, and start creating amazing music. 
              Our team is here to ensure you have everything you need for a successful recording session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-10 py-4 bg-gradient-to-r from-[#5A9BB8] to-[#6BAAC7] text-white font-semibold text-lg rounded-lg hover:scale-105 transition-all duration-300">
                  Get in Touch
                </button>
              </Link>
              <Link href="/services">
                <button className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                  View All Services
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <PulsingCircle />
    </ShaderBackground>
  )
}
