"use client"

import { useEffect, useState } from "react"

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<{
    loadTime: number
    deviceMemory: number | null
    connectionType: string | null
    isMobile: boolean
    screenSize: string
  } | null>(null)

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return

    const startTime = performance.now()
    
    // Wait for page to load
    const timer = setTimeout(() => {
      const loadTime = performance.now() - startTime
      
      setMetrics({
        loadTime: Math.round(loadTime),
        deviceMemory: (navigator as any).deviceMemory || null,
        connectionType: (navigator as any).connection?.effectiveType || null,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">Performance Monitor</div>
      <div>Load Time: {metrics.loadTime}ms</div>
      <div>Device: {metrics.isMobile ? 'Mobile' : 'Desktop'}</div>
      <div>Screen: {metrics.screenSize}</div>
      {metrics.deviceMemory && <div>Memory: {metrics.deviceMemory}GB</div>}
      {metrics.connectionType && <div>Connection: {metrics.connectionType}</div>}
    </div>
  )
}
