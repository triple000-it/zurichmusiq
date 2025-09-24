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
        // Restore any previous inline edits from localStorage
        restoreInlineEdits()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [status, isAdmin])

  // Cleanup when component unmounts or when isEditing changes to false
  useEffect(() => {
    if (!isEditing) {
      // Force cleanup when exiting edit mode
      setTimeout(() => {
        cleanupEditMode()
      }, 100)
    }
  }, [isEditing])

  // Restore inline edits from localStorage
  const restoreInlineEdits = () => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(`inline-edit-${pageSlug}-`))
      keys.forEach(key => {
        const editData = JSON.parse(localStorage.getItem(key) || '{}')
        if (editData.content && editData.elementType) {
          // Find the element and restore its content
          const elements = document.querySelectorAll(editData.elementType)
          if (elements.length > 0) {
            // Apply the edit to the first matching element
            // In a real app, you'd want more sophisticated element identification
            elements[0].textContent = editData.content
          }
        }
      })
    } catch (error) {
      console.error('Error restoring inline edits:', error)
    }
  }

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
    
    // Mark element as edited
    element.setAttribute('data-edited', 'true')
    
    // Save to database
    setIsSaving(true)
    try {
      const response = await fetch(`/api/pages/slug/${pageSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `<div class="inline-edit-${Date.now()}">${newContent}</div>`,
          elementType: element.tagName.toLowerCase(),
          elementText: newContent,
          updatedBy: session?.user?.name || 'Inline Editor',
          editMetadata: {
            elementId: element.id || `element-${Date.now()}`,
            elementClass: element.className,
            elementTag: element.tagName.toLowerCase(),
            timestamp: new Date().toISOString(),
            pageSlug: pageSlug
          }
        }),
      })
      
      if (response.ok) {
        // Show success indicator
        element.style.backgroundColor = '#d4edda'
        element.style.border = '2px solid #28a745'
        setTimeout(() => {
          element.style.backgroundColor = ''
          element.style.border = ''
        }, 2000)
        
        // Show success message
        showSuccessMessage('Saved successfully!')
        
        // Store the edit in localStorage for persistence across page reloads
        const editKey = `inline-edit-${pageSlug}-${element.tagName.toLowerCase()}-${Date.now()}`
        localStorage.setItem(editKey, JSON.stringify({
          content: newContent,
          elementType: element.tagName.toLowerCase(),
          timestamp: new Date().toISOString()
        }))
        
        // Remove edited flag since it's saved
        element.removeAttribute('data-edited')
        
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving:', error)
      // Revert on error
      element.textContent = originalContent
      element.style.backgroundColor = '#f8d7da'
      element.style.border = '2px solid #dc3545'
      setTimeout(() => {
        element.style.backgroundColor = ''
        element.style.border = ''
      }, 2000)
      showErrorMessage('Failed to save changes')
      // Keep edited flag since save failed
    }
    setIsSaving(false)
  }

  const handleCancelInline = (element: HTMLElement) => {
    element.textContent = originalContent
  }

  const showSuccessMessage = (message: string) => {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
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

  const showErrorMessage = (message: string) => {
    const notification = document.createElement('div')
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
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

  const handleExitEditMode = async () => {
    try {
      // Show saving indicator
      setIsSaving(true)
      
      // First, save any pending changes
      await saveAllPendingChanges()
      
      // Clean up all edit mode elements
      cleanupEditMode()
      
      // Remove all edit styling and listeners
      const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], button')
      
      editableElements.forEach(element => {
        element.style.cursor = ''
        element.style.outline = ''
        element.style.outlineOffset = ''
        element.style.backgroundColor = ''
        element.style.border = ''
        element.style.opacity = '1'
        element.removeEventListener('click', handleElementClick)
        element.removeAttribute('data-edited')
      })
      
      // Reset state
      setIsEditing(false)
      setIsSaving(false)
      
      // Show final success message
      showSuccessMessage('All changes saved successfully!')
      
    } catch (error) {
      console.error('Error exiting edit mode:', error)
      setIsSaving(false)
      showErrorMessage('Error saving changes')
    }
  }

  const cleanupEditMode = () => {
    // Remove any remaining input fields
    const remainingInputs = document.querySelectorAll('input[style*="position: absolute"]')
    remainingInputs.forEach(input => {
      input.remove()
    })
    
    // Remove any edit styling from elements
    const editedElements = document.querySelectorAll('[data-edited="true"]')
    editedElements.forEach(element => {
      element.removeAttribute('data-edited')
      element.style.opacity = '1'
      element.style.backgroundColor = ''
      element.style.border = ''
    })
    
    // Remove any edit outlines and styling
    const outlinedElements = document.querySelectorAll('[style*="outline"]')
    outlinedElements.forEach(element => {
      element.style.outline = ''
      element.style.outlineOffset = ''
      element.style.cursor = ''
      element.style.backgroundColor = ''
      element.style.border = ''
    })
    
    // Remove any elements with dashed outlines
    const dashedElements = document.querySelectorAll('[style*="dashed"]')
    dashedElements.forEach(element => {
      element.style.outline = ''
      element.style.outlineOffset = ''
      element.style.cursor = ''
    })
    
    // Reset all elements to normal state
    const allElements = document.querySelectorAll('*')
    allElements.forEach(element => {
      if (element.style.outline === '2px dashed #4fdce5') {
        element.style.outline = ''
        element.style.outlineOffset = ''
        element.style.cursor = ''
      }
    })
  }

  const saveAllPendingChanges = async () => {
    // Find any elements that might have been edited but not saved
    const editedElements = document.querySelectorAll('[data-edited="true"]')
    
    for (const element of editedElements) {
      const newContent = element.textContent || ""
      const elementType = element.tagName.toLowerCase()
      
      try {
        const response = await fetch(`/api/pages/slug/${pageSlug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `<div class="inline-edit-${Date.now()}">${newContent}</div>`,
            elementType: elementType,
            elementText: newContent,
            updatedBy: session?.user?.name || 'Inline Editor',
            editMetadata: {
              elementId: element.id || `element-${Date.now()}`,
              elementClass: element.className,
              elementTag: elementType,
              timestamp: new Date().toISOString(),
              pageSlug: pageSlug
            }
          }),
        })
        
        if (response.ok) {
          // Store in localStorage
          const editKey = `inline-edit-${pageSlug}-${elementType}-${Date.now()}`
          localStorage.setItem(editKey, JSON.stringify({
            content: newContent,
            elementType: elementType,
            timestamp: new Date().toISOString()
          }))
          
          // Remove the edited flag
          element.removeAttribute('data-edited')
        }
      } catch (error) {
        console.error('Error saving pending change:', error)
      }
    }
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
