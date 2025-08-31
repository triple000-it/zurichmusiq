"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import { useRef, useState, useEffect } from "react"

interface ShaderBackgroundProps {
  children: React.ReactNode
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  // Generate truly random star positions across entire background
  const generateParticleStyles = (index: number, total: number) => {
    // Use multiple prime numbers and mathematical constants for true randomness
    const seed1 = (index * 2.71828) % 1
    const seed2 = (index * 3.14159) % 1
    const seed3 = (index * 1.61803) % 1
    const seed4 = (index * 4.66920) % 1
    
    // Generate truly random positions across entire screen
    const left = 5 + (seed1 * 90) // 5% to 95% of screen width
    const top = 5 + (seed2 * 90)  // 5% to 95% of screen height
    
    // Add additional randomness to prevent clustering
    const randomOffsetX = (seed3 * 10) - 5 // -5% to +5% offset
    const randomOffsetY = (seed4 * 10) - 5 // -5% to +5% offset
    
    const finalLeft = left + randomOffsetX
    const finalTop = top + randomOffsetY
    
    // Random size, delay, and duration
    const size = 0.4 + (seed1 * 1.0) // 0.4px to 1.4px
    const delay = seed2 * 3 // 0s to 3s delay
    const twinkleDuration = 2 + (seed3 * 3) // 2s to 5s
    const floatDuration = 20 + (seed4 * 20) // 20s to 40s
    
    return {
      left: `${Math.max(2, Math.min(98, Math.round(finalLeft * 100) / 100))}%`,
      top: `${Math.max(2, Math.min(98, Math.round(finalTop * 100) / 100))}%`,
      width: `${Math.round(size * 10) / 10}px`,
      height: `${Math.round(size * 10) / 10}px`,
      animationDelay: `${Math.round(delay * 10) / 10}s, ${Math.round((delay * 0.7) * 10) / 10}s`,
      animationDuration: `${Math.round(twinkleDuration * 10) / 10}s, ${Math.round(floatDuration * 10) / 10}s`
    }
  }

  const generateBrightStarStyles = (index: number, total: number) => {
    // Generate truly random bright star positions
    const seed1 = (index * 1.41421) % 1 // sqrt(2)
    const seed2 = (index * 2.23606) % 1 // sqrt(5)
    const seed3 = (index * 3.31662) % 1 // sqrt(11)
    const seed4 = (index * 5.65685) % 1 // sqrt(32)
    
    // Truly random positions across entire screen
    const left = 3 + (seed1 * 94) // 3% to 97% of screen width
    const top = 3 + (seed2 * 94)  // 3% to 97% of screen height
    
    // Random size, delay, and duration for bright stars
    const size = 1.5 + (seed3 * 1.5) // 1.5px to 3px
    const delay = seed4 * 4 // 0s to 4s delay
    const twinkleDuration = 3 + (seed1 * 4) // 3s to 7s
    const floatDuration = 30 + (seed2 * 25) // 30s to 55s
    
    return {
      left: `${Math.max(2, Math.min(98, Math.round(left * 100) / 100))}%`,
      top: `${Math.max(2, Math.min(98, Math.round(top * 100) / 100))}%`,
      width: `${Math.round(size * 10) / 10}px`,
      height: `${Math.round(size * 10) / 10}px`,
      animationDelay: `${Math.round(delay * 10) / 10}s, ${Math.round((delay * 0.8) * 10) / 10}s`,
      animationDuration: `${Math.round(twinkleDuration * 10) / 10}s, ${Math.round(floatDuration * 10) / 10}s`
    }
  }

  const generateShootingStarStyles = (index: number, total: number) => {
    // Generate truly random shooting star positions
    const seed1 = (index * 7.38905) % 1 // sqrt(54.6)
    const seed2 = (index * 8.66025) % 1 // sqrt(75)
    const seed3 = (index * 9.48683) % 1 // sqrt(90)
    
    // Truly random positions across entire screen
    const left = 5 + (seed1 * 90) // 5% to 95% of screen width
    const top = 5 + (seed2 * 90)  // 5% to 95% of screen height
    
    // Random size, delay, and duration for shooting stars
    const size = 0.8 + (seed3 * 1.4) // 0.8px to 2.2px
    const delay = seed1 * 6 // 0s to 6s delay
    const duration = 5 + (seed2 * 4) // 5s to 9s
    
    return {
      left: `${Math.max(3, Math.min(97, Math.round(left * 100) / 100))}%`,
      top: `${Math.max(3, Math.min(97, Math.round(top * 100) / 100))}%`,
      width: `${Math.round(size * 10) / 10}px`,
      height: `${Math.round(size * 10) / 10}px`,
      animationDelay: `${Math.round(delay * 10) / 10}s`,
      animationDuration: `${Math.round(duration * 10) / 10}s`
    }
  }

  return (
    <>
      {/* Fixed Background Container with Fallback */}
      <div 
        ref={containerRef} 
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(79, 220, 229, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(79, 220, 229, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(79, 220, 229, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #001a1a 25%, #000000 50%, #001a1a 75%, #000000 100%)
          `
        }}
      >
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

        {/* Background Shaders - More Active Movement */}
      <MeshGradient
          className="absolute inset-0 w-full h-full opacity-90"
          colors={["#000000", "#000000", "#4fdce5", "#000000", "#000000"]}
          speed={0.35}
      />
      <MeshGradient
          className="absolute inset-0 w-full h-full opacity-30"
          colors={["#000000", "#000000", "#4fdce5", "#000000"]}
          speed={0.25}
        />

        {/* Enhanced Space Particles with Improved Distribution */}
        <div className="absolute inset-0 w-full h-full">
          {/* Twinkling Stars with Better Distribution */}
          {[...Array(150)].map((_, i) => {
            const styles = generateParticleStyles(i, 150)
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  ...styles,
                  background: `radial-gradient(circle, rgba(255, 255, 255, ${0.7 + (i % 3) * 0.1}) 0%, rgba(79, 220, 229, ${0.2 + (i % 2) * 0.1}) 50%, transparent 100%)`,
                  animation: `twinkle ${styles.animationDuration.split(',')[0]}, float ${styles.animationDuration.split(',')[1]}`,
                  filter: 'blur(0.2px)',
                  boxShadow: `0 0 ${2 + (i % 3) * 2}px rgba(255, 255, 255, ${0.4 + (i % 3) * 0.1})`,
                }}
              />
            )
          })}

          {/* Bright Stars (Bigger, More Prominent) */}
          {[...Array(30)].map((_, i) => {
            const styles = generateBrightStarStyles(i, 30)
            return (
              <div
                key={`bright-${i}`}
                className="absolute rounded-full"
                style={{
                  ...styles,
                  background: `radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(79, 220, 229, 0.4) 40%, rgba(79, 220, 229, 0.1) 80%, transparent 100%)`,
                  animation: `bright-twinkle ${styles.animationDuration.split(',')[0]}, slow-float ${styles.animationDuration.split(',')[1]}`,
                  filter: 'blur(0.3px)',
                  boxShadow: `0 0 ${4 + (i % 3) * 2}px rgba(79, 220, 229, ${0.2 + (i % 2) * 0.1})`,
                }}
              />
            )
          })}

          {/* Floating Nebula Clouds (Reduced Blue) */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(30, 58, 138, 0.1) 0%, transparent 70%)'
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
              animationDelay: '2s'
            }}
          />

          {/* Cosmic Dust (Reduced Blue) */}
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(79, 220, 229, 0.05) 0%, transparent 50%)'
            }}
          />

          {/* Shooting Stars (Reduced Blue) */}
          {[...Array(8)].map((_, i) => {
            const styles = generateShootingStarStyles(i, 8)
            return (
              <div
                key={`shooting-${i}`}
                className="absolute rounded-full"
                style={{
                  ...styles,
                  background: `linear-gradient(45deg, rgba(255, 255, 255, 0.9) 0%, rgba(79, 220, 229, 0.3) 50%, transparent 100%)`,
                  animation: `shooting-star ${styles.animationDuration}`,
                  filter: 'blur(0.5px)',
                  boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(79, 220, 229, 0.3)`,
                }}
              />
            )
          })}

          {/* Additional Space Elements (Reduced Blue) */}
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(79, 220, 229, 0.04) 0%, transparent 60%)',
              animationDelay: '4s'
            }}
          />
        </div>

        {/* Custom CSS for enhanced star animations with random movement and repositioning */}
        <style jsx>{`
          @keyframes twinkle {
            0% { 
              opacity: 0; 
              transform: translate(0px, 0px) scale(0.5) rotate(0deg); 
            }
            15% { 
              opacity: 0.6; 
              transform: translate(8px, -5px) scale(1.1) rotate(45deg); 
            }
            30% { 
              opacity: 1; 
              transform: translate(-12px, 10px) scale(1.4) rotate(90deg); 
            }
            45% { 
              opacity: 0.8; 
              transform: translate(15px, 3px) scale(1.2) rotate(135deg); 
            }
            60% { 
              opacity: 0.4; 
              transform: translate(-8px, -12px) scale(0.9) rotate(180deg); 
            }
            75% { 
              opacity: 0.7; 
              transform: translate(20px, 8px) scale(1.3) rotate(225deg); 
            }
            90% { 
              opacity: 0.2; 
              transform: translate(-15px, -6px) scale(0.7) rotate(315deg); 
            }
            100% { 
              opacity: 0; 
              transform: translate(25px, -18px) scale(0.3) rotate(360deg); 
            }
          }

          @keyframes bright-twinkle {
            0% { 
              opacity: 0; 
              transform: translate(0px, 0px) scale(0.6) rotate(0deg); 
            }
            20% { 
              opacity: 0.8; 
              transform: translate(-10px, 8px) scale(1.2) rotate(60deg); 
            }
            40% { 
              opacity: 1; 
              transform: translate(18px, -12px) scale(1.6) rotate(120deg); 
            }
            60% { 
              opacity: 0.9; 
              transform: translate(-5px, 15px) scale(1.4) rotate(180deg); 
            }
            80% { 
              opacity: 0.3; 
              transform: translate(22px, -8px) scale(0.8) rotate(240deg); 
            }
            100% { 
              opacity: 0; 
              transform: translate(-20px, 25px) scale(0.4) rotate(360deg); 
            }
          }

          @keyframes float {
            0% { 
              transform: translate(0px, 0px) rotate(0deg) scale(1); 
              opacity: 0; 
            }
            12% { 
              transform: translate(15px, -8px) rotate(43deg) scale(1.15); 
              opacity: 0.5; 
            }
            25% { 
              transform: translate(-20px, 18px) rotate(90deg) scale(1.3); 
              opacity: 0.8; 
            }
            37% { 
              transform: translate(25px, -12px) rotate(133deg) scale(0.9); 
              opacity: 1; 
            }
            50% { 
              transform: translate(-18px, 22px) rotate(180deg) scale(1.2); 
              opacity: 0.9; 
            }
            62% { 
              transform: translate(30px, -15px) rotate(223deg) scale(1.1); 
              opacity: 0.7; 
            }
            75% { 
              transform: translate(-25px, 28px) rotate(270deg) scale(0.8); 
              opacity: 0.4; 
            }
            87% { 
              transform: translate(35px, -20px) rotate(313deg) scale(1.0); 
              opacity: 0.2; 
            }
            100% { 
              transform: translate(-40px, 35px) rotate(360deg) scale(0.5); 
              opacity: 0; 
            }
          }

          @keyframes slow-float {
            0% { 
              transform: translate(0px, 0px) rotate(0deg) scale(1); 
              opacity: 0; 
            }
            16% { 
              transform: translate(-12px, 10px) rotate(58deg) scale(1.18); 
              opacity: 0.6; 
            }
            33% { 
              transform: translate(20px, -15px) rotate(119deg) scale(0.95); 
              opacity: 0.9; 
            }
            50% { 
              transform: translate(-25px, 22px) rotate(180deg) scale(1.25); 
              opacity: 1; 
            }
            66% { 
              transform: translate(28px, -18px) rotate(238deg) scale(1.05); 
              opacity: 0.8; 
            }
            83% { 
              transform: translate(-22px, 30px) rotate(298deg) scale(0.85); 
              opacity: 0.3; 
            }
            100% { 
              transform: translate(35px, -25px) rotate(360deg) scale(0.6); 
              opacity: 0; 
            }
          }

          @keyframes shooting-star {
            0% {
              transform: translateX(0px) translateY(0px) rotate(45deg) scale(0.5);
              opacity: 0;
            }
            8% {
              transform: translateX(25px) translateY(25px) rotate(45deg) scale(1.0);
              opacity: 0.4;
            }
            20% {
              transform: translateX(65px) translateY(65px) rotate(45deg) scale(1.5);
              opacity: 0.8;
            }
            35% {
              transform: translateX(130px) translateY(130px) rotate(45deg) scale(1.8);
              opacity: 1;
            }
            50% {
              transform: translateX(200px) translateY(200px) rotate(45deg) scale(1.6);
              opacity: 0.9;
            }
            65% {
              transform: translateX(280px) translateY(280px) rotate(45deg) scale(1.2);
              opacity: 0.6;
            }
            80% {
              transform: translateX(350px) translateY(350px) rotate(45deg) scale(0.8);
              opacity: 0.3;
            }
            95% {
              transform: translateX(420px) translateY(420px) rotate(45deg) scale(0.4);
              opacity: 0.1;
            }
            100% {
              transform: translateX(500px) translateY(500px) rotate(45deg) scale(0.2);
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative w-full">
      {children}
    </div>
    </>
  )
}
