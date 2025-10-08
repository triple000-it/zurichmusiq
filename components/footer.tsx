"use client"

import Image from "next/image"

export default function Footer() {
  return (
    <footer className="relative z-20 px-8 lg:px-16 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl shadow-black/20">
          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo and Description */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-6">
                  <Image
                    src="/LOGO-ZURICHMUSIQ-WIT.png"
                    alt="Zurich Musiq Logo"
                    width={140}
                    height={45}
                    className="w-35 h-auto"
                  />
                </div>
                <p className="text-white/80 text-lg leading-relaxed max-w-md">
                  Professional music recording studio offering state-of-the-art recording, mixing, mastering, and music production services. 
                  We help artists bring their musical vision to life.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-3">
                <li><a href="/about" className="text-white/70 hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="/music" className="text-white/70 hover:text-white transition-colors duration-200">Music</a></li>
                <li><a href="/services" className="text-white/70 hover:text-white transition-colors duration-200">Services</a></li>
                <li><a href="/booking" className="text-white/70 hover:text-white transition-colors duration-200">Studio Booking</a></li>
                <li><a href="/contact" className="text-white/70 hover:text-white transition-colors duration-200">Contact</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
                <ul className="space-y-3 text-white/70">
                  <li>Rotterdam, The Netherlands</li>
                  <li><a href="mailto:info@zurichmusiq.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors duration-200">info@zurichmusiq.com</a></li>
                  <li>+316XXXXXXXX</li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm">
              Zurich Musiq © 2025
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-200 text-sm">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
