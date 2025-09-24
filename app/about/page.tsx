"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import Image from "next/image"
import Link from "next/link"
import InlineEditor from "@/components/inline-editor"

interface TeamMember {
  name: string
  role: string
  bio: string
  expertise: string[]
}

const teamMembers: TeamMember[] = [
  {
    name: "Marcus Weber",
    role: "Founder & Lead Engineer",
    bio: "With over 15 years of experience in music production, Marcus has worked with artists across all genres. His passion for sound quality and attention to detail has made him one of Switzerland's most sought-after engineers.",
    expertise: ["Mixing", "Mastering", "Music Production", "Studio Design"]
  },
  {
    name: "Elena Rodriguez",
    role: "Senior Producer",
    bio: "Elena brings a unique blend of classical training and modern production techniques. She specializes in helping artists find their authentic voice while maintaining commercial appeal.",
    expertise: ["Artist Development", "Music Production", "Vocal Production", "Arrangement"]
  },
  {
    name: "David Chen",
    role: "Studio Manager & Engineer",
    bio: "David ensures every session runs smoothly while maintaining our high standards of audio quality. His technical expertise covers everything from analog gear to the latest digital tools.",
    expertise: ["Recording", "Studio Management", "Equipment Maintenance", "Technical Support"]
  },
  {
    name: "Sophie Müller",
    role: "Marketing & Artist Relations",
    bio: "Sophie helps artists build their brand and connect with their audience. Her industry connections and strategic thinking have helped numerous artists achieve breakthrough success.",
    expertise: ["Branding", "Marketing Strategy", "Industry Networking", "Artist Relations"]
  }
]

export default function AboutPage() {

  return (
    <ShaderBackground>
      <Header />
      
      {/* Inline Editor */}
      <InlineEditor pageSlug="about" pageTitle="About Us" />
      
      <main className="relative z-20 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-20">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
                About Us
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                We're a passionate team of music professionals dedicated to helping artists 
                create their best work in a world-class recording environment.
              </p>
            </div>

            {/* Company Story */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-20" >
              <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Story</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    Founded in 2010, Zurich Musiq began as a small recording studio with a big dream: to provide world-class recording facilities to artists of all levels. What started as a passion project has grown into one of Switzerland's most respected recording studios.
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    Over the years, we've had the privilege of working with emerging artists, established musicians, and everything in between. Our commitment to quality and innovation has earned us recognition in the music industry and the trust of our clients.
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Today, we continue to push the boundaries of what's possible in music production, combining cutting-edge technology with time-tested techniques to help artists create their best work.
                  </p>
                </div>
                <div className="bg-gray-300 rounded-lg aspect-square flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Studio Photo</span>
                </div>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20" >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
                <p className="text-white/80 leading-relaxed">
                  To provide world-class recording facilities and professional guidance that empowers artists 
                  to create their best work, regardless of their budget or experience level.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Our Values</h3>
                <ul className="text-white/80 space-y-2">
                  <li>• Quality without compromise</li>
                  <li>• Innovation in technology and technique</li>
                  <li>• Support for emerging artists</li>
                  <li>• Sustainable business practices</li>
                  <li>• Community and collaboration</li>
                </ul>
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-20" >
              <h2 className="text-4xl font-bold text-white mb-12 text-center">Meet Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 text-xs">Photo</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-[#4fdce5] font-medium mb-3">{member.role}</p>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">{member.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-[#4fdce5]/20 text-[#4fdce5] text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Studio Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-20" >
              <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Studio</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4fdce5] mb-2">2</div>
                  <div className="text-white/80">Professional Studios</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4fdce5] mb-2">24/7</div>
                  <div className="text-white/80">Access Available</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#4fdce5] mb-2">State-of-the-Art</div>
                  <div className="text-white/80">Equipment</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center" >
              <h3 className="text-3xl font-bold text-white mb-8">
                Ready to Work With Us?
              </h3>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Whether you're looking to record your next hit or develop your skills, 
                we're here to help you achieve your musical goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="px-10 py-4 bg-[#4fdce5] text-black font-semibold text-lg rounded-lg hover:bg-[#3cc9d3] hover:scale-105 transition-all duration-300">
                    Get in Touch
                  </button>
                </Link>
                <Link href="/services">
                  <button className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    View Services
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
