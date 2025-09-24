"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Edit3, X, Save } from "lucide-react"

interface SimpleInlineEditorProps {
  pageSlug: string
  pageTitle: string
}

export default function SimpleInlineEditor({ pageSlug, pageTitle }: SimpleInlineEditorProps) {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Map<string, string>>(new Map())

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

  const handleEditMode = () => {
    setIsEditing(true)
    
    // Add edit styling to all text elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], button')
    textElements.forEach(element => {
      element.style.outline = '2px dashed #4fdce5'
      element.style.outlineOffset = '2px'
      element.style.cursor = 'pointer'
      element.setAttribute('contenteditable', 'true')
      
      element.addEventListener('input', handleTextChange)
    })

    // Add edit styling to images
    const imageElements = document.querySelectorAll('img')
    imageElements.forEach(element => {
      element.style.outline = '2px dashed #4fdce5'
      element.style.outlineOffset = '2px'
      element.style.cursor = 'pointer'
      
      element.addEventListener('click', handleImageClick)
    })
  }

  const handleTextChange = (e: Event) => {
    const element = e.target as HTMLElement
    const elementId = element.id || `element-${Date.now()}`
    setPendingChanges(prev => new Map(prev.set(elementId, element.innerHTML)))
  }

  const handleImageClick = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    
    const img = e.target as HTMLImageElement
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      // Upload image
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          img.src = data.url
          img.alt = file.name
          
          // Save the change
          const elementId = img.id || `img-${Date.now()}`
          setPendingChanges(prev => new Map(prev.set(elementId, img.outerHTML)))
          
          showNotification('Image uploaded successfully!', 'success')
        }
      } catch (error) {
        showNotification('Failed to upload image', 'error')
      }
    }
    
    input.click()
  }

  const handleSave = async () => {
    if (pendingChanges.size === 0) {
      showNotification('No changes to save', 'info')
      return
    }

    try {
      // Get the current page content - get the entire main content
      const mainContent = document.querySelector('main')
      if (!mainContent) {
        throw new Error('Could not find main content')
      }

      const response = await fetch(`/api/pages/slug/${pageSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: mainContent.innerHTML,
          updatedBy: session?.user?.name || 'Simple Editor',
        }),
      })

      if (response.ok) {
        showNotification('Changes saved successfully!', 'success')
        setPendingChanges(new Map())
        
        // Refresh page after 1 second to show changes
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save')
      }
    } catch (error) {
      console.error('Save error:', error)
      showNotification('Failed to save changes', 'error')
    }
  }

  const handleExitEditMode = () => {
    setIsEditing(false)
    
    // Remove edit styling and event listeners
    const allElements = document.querySelectorAll('*')
    allElements.forEach(element => {
      element.style.outline = ''
      element.style.outlineOffset = ''
      element.style.cursor = ''
      element.removeAttribute('contenteditable')
      element.removeEventListener('input', handleTextChange)
      element.removeEventListener('click', handleImageClick)
    })

    // Save any pending changes
    if (pendingChanges.size > 0) {
      handleSave()
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={isEditing ? handleExitEditMode : handleEditMode}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-colors ${
          isEditing
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        title={isEditing ? `Exit Edit Mode` : `Edit ${pageTitle}`}
      >
        {isEditing ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
      </button>

      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed top-16 right-4 z-50 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-4 w-4" />
            <span className="font-medium">Click any text or image to edit</span>
          </div>
        </div>
      )}

      {/* Save Button */}
      {isEditing && pendingChanges.size > 0 && (
        <button
          onClick={handleSave}
          className="fixed top-24 right-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes ({pendingChanges.size})</span>
        </button>
      )}
    </>
  )
}
