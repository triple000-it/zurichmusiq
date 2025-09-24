"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Edit3 } from "lucide-react"

interface UniversalEditButtonProps {
  pageSlug: string
  pageTitle: string
}

export default function UniversalEditButton({ pageSlug, pageTitle }: UniversalEditButtonProps) {
  const { data: session, status } = useSession()
  const [isVisible, setIsVisible] = useState(false)
  
  // Check if user is admin
  const isAdmin = session?.user?.role && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)
  
  // Show button after session is loaded
  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [status, isAdmin])

  // Don't render anything if user is not admin or not visible yet
  if (!isAdmin || !isVisible) {
    return null
  }

  const handleEdit = () => {
    // For now, just show an alert. Later we can implement actual editing
    alert(`Edit functionality for "${pageTitle}" (${pageSlug}) will be implemented soon!`)
  }

  return (
    <button
      onClick={handleEdit}
      className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
      title={`Edit ${pageTitle}`}
    >
      <Edit3 className="h-5 w-5" />
    </button>
  )
}
