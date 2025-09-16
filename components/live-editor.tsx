"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { 
  Edit3, 
  Save, 
  X, 
  Bold, 
  Italic, 
  Underline,
  Link,
  Image,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"

interface LiveEditorProps {
  pageId: string
  pageSlug: string
  children: React.ReactNode
  className?: string
}

export default function LiveEditor({ pageId, pageSlug, children, className = "" }: LiveEditorProps) {
  const { data: session } = useSession()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingElement, setEditingElement] = useState<HTMLElement | null>(null)
  const [originalContent, setOriginalContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if user can edit
  const canEdit = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isEditMode || !canEdit) return

      const target = e.target as HTMLElement
      const editableElement = target.closest('[data-editable]') as HTMLElement

      if (editableElement) {
        e.preventDefault()
        e.stopPropagation()
        startEditing(editableElement)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing) {
        cancelEditing()
      }
    }

    if (isEditMode) {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditMode, canEdit, isEditing])

  const startEditing = (element: HTMLElement) => {
    if (isEditing) return

    setEditingElement(element)
    setOriginalContent(element.innerHTML)
    setIsEditing(true)
    element.contentEditable = 'true'
    element.focus()
    
    // Show toolbar
    const rect = element.getBoundingClientRect()
    setToolbarPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 50
    })
    setShowToolbar(true)
  }

  const cancelEditing = () => {
    if (editingElement) {
      editingElement.innerHTML = originalContent
      editingElement.contentEditable = 'false'
      editingElement.blur()
    }
    setIsEditing(false)
    setEditingElement(null)
    setShowToolbar(false)
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
        setShowToolbar(false)
        setIsEditMode(false)
        
        // Show success message
        showNotification('Content saved successfully!', 'success')
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      showNotification('Failed to save content. Please try again.', 'error')
      cancelEditing()
    } finally {
      setIsSaving(false)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  const execCommand = (command: string, value?: string) => {
    if (editingElement) {
      document.execCommand(command, false, value)
      editingElement.focus()
    }
  }

  if (!canEdit) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Edit Mode Toggle */}
      {!isEditMode && (
        <button
          onClick={() => setIsEditMode(true)}
          className="fixed top-4 right-4 z-40 bg-[#4fdce5] text-black px-4 py-2 rounded-lg shadow-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Edit Page
        </button>
      )}

      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="fixed top-4 right-4 z-40 bg-white rounded-lg shadow-lg border p-2 flex items-center gap-2">
          <button
            onClick={() => setIsEditMode(false)}
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
      {showToolbar && isEditing && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border p-2 flex items-center gap-1"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
          }}
        >
          <button
            onClick={() => execCommand('bold')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('italic')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('underline')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <button
            onClick={() => execCommand('formatBlock', 'h1')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'h2')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('formatBlock', 'h3')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <button
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <button
            onClick={() => execCommand('justifyLeft')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyCenter')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => execCommand('justifyRight')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
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
      <div className={isEditMode ? 'live-editor-mode' : ''}>
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
