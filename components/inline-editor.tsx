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
      const [showImageUpload, setShowImageUpload] = useState(false)
      const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
      const [imageFile, setImageFile] = useState<File | null>(null)
  
  // Check if user is admin
  const isAdmin = session?.user?.role && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)
  
  // Define cleanup function first
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

  // Force cleanup when isEditing becomes false
  useEffect(() => {
    if (!isEditing) {
      // Aggressive cleanup when exiting edit mode
      const cleanup = () => {
        // Remove all input fields
        const inputs = document.querySelectorAll('input[style*="position: absolute"]')
        inputs.forEach(input => input.remove())
        
        // Remove any edit elements
        const editElements = document.querySelectorAll('[style*="border: 2px solid #4fdce5"]')
        editElements.forEach(element => element.remove())
        
        // Clean up all styling
        const allElements = document.querySelectorAll('*')
        allElements.forEach(element => {
          if (element.style.outline === '2px dashed #4fdce5') {
            element.style.outline = ''
            element.style.outlineOffset = ''
            element.style.cursor = ''
          }
        })
      }
      
      cleanup()
      // Run cleanup again after a short delay
      setTimeout(cleanup, 100)
    }
  }, [isEditing])

  // Don't render anything if user is not admin or not visible yet
  if (!isAdmin || !isVisible) {
    return null
  }

      const handleEditMode = () => {
        setIsEditing(true)

        // Add click listeners to all editable elements
        const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], button')
        const imageElements = document.querySelectorAll('img')

        editableElements.forEach(element => {
          element.style.cursor = 'pointer'
          element.style.outline = '2px dashed #4fdce5'
          element.style.outlineOffset = '2px'

          element.addEventListener('click', handleElementClick)
        })

        imageElements.forEach(element => {
          element.style.cursor = 'pointer'
          element.style.outline = '2px dashed #4fdce5'
          element.style.outlineOffset = '2px'

          element.addEventListener('click', handleImageClick)
        })
      }

  const handleImageClick = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const imgElement = e.target as HTMLImageElement
    setSelectedImage(imgElement)
    setShowImageUpload(true)
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
        
        // Trigger page refresh to show changes immediately
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        
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

  const handleImageUpload = async () => {
    if (!imageFile || !selectedImage) return

    setIsSaving(true)
    try {
      // Upload the image
      const formData = new FormData()
      formData.append('file', imageFile)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const uploadData = await uploadResponse.json()
      const newImageUrl = uploadData.url

      // Update the image src
      selectedImage.src = newImageUrl
      selectedImage.alt = imageFile.name

      // Save the updated content to the database
      const response = await fetch(`/api/pages/slug/${pageSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: document.documentElement.outerHTML,
          updatedBy: session?.user?.name || 'Inline Editor',
          editMetadata: {
            elementId: selectedImage.id || `img-${Date.now()}`,
            elementClass: selectedImage.className,
            elementTag: 'img',
            timestamp: new Date().toISOString(),
            pageSlug: pageSlug,
            newImageUrl: newImageUrl
          }
        }),
      })

      if (response.ok) {
        showSuccessMessage('Image uploaded successfully!')
        
        // Trigger page refresh to show changes
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        throw new Error('Failed to save image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showErrorMessage('Failed to upload image')
    } finally {
      setIsSaving(false)
      setShowImageUpload(false)
      setSelectedImage(null)
      setImageFile(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
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

  const handleExitEditMode = (e: React.MouseEvent) => {
    // Prevent any event bubbling
    e.preventDefault()
    e.stopPropagation()
    
    // Force exit immediately
    setIsEditing(false)
    setIsSaving(false)
    
    // Remove ALL input fields immediately
    const inputs = document.querySelectorAll('input')
    inputs.forEach(input => {
      if (input.style.position === 'absolute' || input.style.border.includes('4fdce5')) {
        input.remove()
      }
    })
    
    // Remove any white popup boxes with blue borders
    const whitePopups = document.querySelectorAll('[style*="background: white"], [style*="background:white"]')
    whitePopups.forEach(popup => {
      if (popup.style.border && popup.style.border.includes('4fdce5')) {
        popup.remove()
      }
    })
    
    // Force remove any elements with the edit styling
    const editElements = document.querySelectorAll('[style*="border: 2px solid #4fdce5"]')
    editElements.forEach(element => element.remove())
    
        // Remove all edit styling from page elements
        const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button')
        const imageElements = document.querySelectorAll('img')
        
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

        imageElements.forEach(element => {
          element.style.cursor = ''
          element.style.outline = ''
          element.style.outlineOffset = ''
          element.removeEventListener('click', handleImageClick)
        })
    
    // Save silently
    saveAllPendingChangesSilently()
    
    // Force a re-render to ensure state is updated
    setTimeout(() => {
      setIsEditing(false)
    }, 10)
  }

  const saveAllPendingChangesSilently = () => {
    // Save changes in background without any UI indicators
    const editedElements = document.querySelectorAll('[data-edited="true"]')
    
    editedElements.forEach(element => {
      const newContent = element.textContent || ""
      const elementType = element.tagName.toLowerCase()
      
      // Save to database silently
      fetch(`/api/pages/slug/${pageSlug}`, {
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
      }).then(response => {
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
          
          // Trigger page refresh to show changes
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }
      }).catch(error => {
        console.error('Error saving pending change:', error)
      })
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

          {/* Edit Mode Indicator - Yellow one that you want back */}
          {isEditing && (
            <div className="fixed top-16 right-4 z-50 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span className="font-medium">Click any text or image to edit</span>
              </div>
            </div>
          )}

          {/* Image Upload Modal */}
          {showImageUpload && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Upload New Image</h3>
                
                <div className="mb-4">
                  <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Image File
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]"
                  />
                </div>

                {imageFile && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Selected file: {imageFile.name}</p>
                    <p className="text-xs text-gray-500">Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleImageUpload}
                    disabled={!imageFile || isSaving}
                    className="flex-1 bg-[#4fdce5] hover:bg-[#3cc9d3] disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {isSaving ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <button
                    onClick={() => {
                      setShowImageUpload(false)
                      setSelectedImage(null)
                      setImageFile(null)
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )
    }
