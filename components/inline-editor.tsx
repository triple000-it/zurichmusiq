"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Edit3, Save, X, Check } from "lucide-react"

interface InlineEditorProps {
  pageSlug: string
  pageTitle: string
}

export default function InlineEditor({ pageSlug, pageTitle }: InlineEditorProps) {
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [editingElement, setEditingElement] = useState<HTMLElement | null>(null)
  const [originalContent, setOriginalContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  
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
    
    // Add click listeners to all editable elements
    const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], button')
    
    editableElements.forEach(element => {
      element.style.cursor = 'pointer'
      element.style.outline = '2px dashed #4fdce5'
      element.style.outlineOffset = '2px'
      
      element.addEventListener('click', handleElementClick)
    })
  }

  const handleElementClick = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    
    const element = e.target as HTMLElement
    setEditingElement(element)
    setOriginalContent(element.textContent || "")
    
    // Create inline input
    const input = document.createElement('input')
    input.type = 'text'
    input.value = element.textContent || ""
    input.style.cssText = `
      position: absolute;
      top: ${element.offsetTop}px;
      left: ${element.offsetLeft}px;
      width: ${element.offsetWidth}px;
      height: ${element.offsetHeight}px;
      border: 2px solid #4fdce5;
      background: white;
      color: black;
      font-size: inherit;
      font-family: inherit;
      font-weight: inherit;
      text-align: inherit;
      padding: 4px;
      z-index: 1000;
    `
    
    // Hide original element
    element.style.opacity = '0'
    
    // Add input to page
    element.parentElement?.appendChild(input)
    input.focus()
    input.select()
    
    // Handle save on Enter or Escape
    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Enter') {
        handleSaveInline(input, element)
        cleanup()
      } else if (keyEvent.key === 'Escape') {
        handleCancelInline(element)
        cleanup()
      }
    }
    
    const cleanup = () => {
      input.remove()
      element.style.opacity = '1'
      input.removeEventListener('keydown', handleKeyDown)
    }
    
    input.addEventListener('keydown', handleKeyDown)
    
    // Handle click outside to save
    const handleClickOutside = (clickEvent: Event) => {
      if (clickEvent.target !== input) {
        handleSaveInline(input, element)
        cleanup()
        document.removeEventListener('click', handleClickOutside)
      }
    }
    
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
  }

  const handleSaveInline = async (input: HTMLInputElement, element: HTMLElement) => {
    const newContent = input.value
    element.textContent = newContent
    
    // Save to database
    setIsSaving(true)
    try {
      const response = await fetch(`/api/pages/${pageSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
          updatedBy: session?.user?.name || 'Inline Editor'
        }),
      })
      
      if (response.ok) {
        // Show success indicator
        element.style.backgroundColor = '#d4edda'
        setTimeout(() => {
          element.style.backgroundColor = ''
        }, 1000)
      }
    } catch (error) {
      console.error('Error saving:', error)
      // Revert on error
      element.textContent = originalContent
    }
    setIsSaving(false)
  }

  const handleCancelInline = (element: HTMLElement) => {
    element.textContent = originalContent
  }

  const handleExitEditMode = () => {
    setIsEditing(false)
    
    // Remove all edit styling and listeners
    const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], button')
    
    editableElements.forEach(element => {
      element.style.cursor = ''
      element.style.outline = ''
      element.style.outlineOffset = ''
      element.removeEventListener('click', handleElementClick)
    })
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
            <span className="font-medium">Click any text to edit</span>
          </div>
        </div>
      )}

      {/* Saving Indicator */}
      {isSaving && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Saving...</span>
          </div>
        </div>
      )}
    </>
  )
}
