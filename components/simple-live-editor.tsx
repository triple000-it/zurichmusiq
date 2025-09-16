"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Edit3, Save, X } from "lucide-react"

interface SimpleLiveEditorProps {
  pageId: string
  pageSlug: string
  children: React.ReactNode
  className?: string
}

export default function SimpleLiveEditor({ pageId, pageSlug, children, className = "" }: SimpleLiveEditorProps) {
  const { data: session, status } = useSession()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingElement, setEditingElement] = useState<HTMLElement | null>(null)
  const [originalContent, setOriginalContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Check if user can edit
  const canEdit = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)
  
  // Debug logging
  console.log('SimpleLiveEditor render:', {
    session: !!session,
    userRole: session?.user?.role,
    canEdit,
    isEditMode,
    status
  })

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Edit Page button clicked! Setting edit mode to true')
    setIsEditMode(true)
  }

  const handleExitEdit = () => {
    console.log('Exiting edit mode')
    setIsEditMode(false)
    setIsEditing(false)
    setEditingElement(null)
  }

  const handleElementClick = (e: React.MouseEvent) => {
    if (!isEditMode || !canEdit) return

    const target = e.target as HTMLElement
    const editableElement = target.closest('[data-editable]') as HTMLElement

    if (editableElement) {
      e.preventDefault()
      e.stopPropagation()
      console.log('Editable element clicked:', editableElement)
      startEditing(editableElement)
    }
  }

  const startEditing = (element: HTMLElement) => {
    if (isEditing) return

    setEditingElement(element)
    setOriginalContent(element.innerHTML)
    setIsEditing(true)
    element.contentEditable = 'true'
    element.focus()
  }

  const cancelEditing = () => {
    if (editingElement) {
      editingElement.innerHTML = originalContent
      editingElement.contentEditable = 'false'
      editingElement.blur()
    }
    setIsEditing(false)
    setEditingElement(null)
  }

  const saveContent = async () => {
    if (!editingElement) return

    setIsSaving(true)
    try {
      const newContent = editingElement.innerHTML
      
      // Update the page content in database
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newContent,
          updatedBy: session?.user?.name || 'Unknown'
        }),
      })

      if (response.ok) {
        // Success - exit edit mode
        editingElement.contentEditable = 'false'
        setIsEditing(false)
        setEditingElement(null)
        setIsEditMode(false)
        
        // Show success message
        alert('Content saved successfully!')
        
        // Reload page to show updated content
        window.location.reload()
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
      cancelEditing()
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading state while session is loading
  if (status === "loading") {
    return <div className={className}>{children}</div>
  }

  // If user doesn't have edit permissions, show content without edit button
  if (!canEdit) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative ${className}`}>
      {/* Edit Mode Toggle */}
      {!isEditMode && (
        <button
          onClick={handleEditClick}
          onMouseDown={(e) => {
            console.log('Edit Page button mouse down')
            e.preventDefault()
          }}
          onMouseUp={(e) => {
            console.log('Edit Page button mouse up')
            e.preventDefault()
          }}
          className="fixed top-4 right-4 z-[9999] bg-[#4fdce5] text-black px-4 py-2 rounded-lg shadow-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2 cursor-pointer"
          style={{ 
            pointerEvents: 'auto',
            zIndex: 9999,
            position: 'fixed',
            top: '16px',
            right: '16px'
          }}
        >
          <Edit3 className="h-4 w-4" />
          Edit Page
        </button>
      )}

      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="fixed top-4 right-4 z-[9999] bg-white rounded-lg shadow-lg border p-2 flex items-center gap-2">
          <button
            onClick={handleExitEdit}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Exit Edit Mode"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <span className="text-sm text-gray-600">Click any text to edit</span>
        </div>
      )}

      {/* Floating Toolbar */}
      {isEditing && editingElement && (
        <div className="fixed top-20 right-4 z-[9999] bg-white rounded-lg shadow-lg border p-2 flex items-center gap-2">
          <button
            onClick={saveContent}
            disabled={isSaving}
            className="p-2 bg-[#4fdce5] text-black rounded hover:bg-[#3cc9d3] disabled:opacity-50"
            title="Save Changes"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={cancelEditing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Content with Editable Elements */}
      <div 
        className={isEditMode ? 'live-editor-mode' : ''}
        onClick={handleElementClick}
      >
        {children}
      </div>

      {/* Edit Mode Styles */}
      <style jsx>{`
        .live-editor-mode [data-editable] {
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .live-editor-mode [data-editable]:hover {
          background-color: rgba(79, 220, 229, 0.1);
          outline: 2px dashed rgba(79, 220, 229, 0.5);
          outline-offset: 2px;
        }
        
        .live-editor-mode [data-editable]:hover::after {
          content: 'Click to edit';
          position: absolute;
          top: -25px;
          left: 0;
          background: #4fdce5;
          color: black;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 10;
        }
        
        [contenteditable="true"] {
          outline: 2px solid #4fdce5 !important;
          outline-offset: 2px !important;
          background-color: rgba(79, 220, 229, 0.05) !important;
        }
      `}</style>
    </div>
  )
}
