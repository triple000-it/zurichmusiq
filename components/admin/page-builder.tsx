"use client"

import { useState, useRef } from "react"
import { 
  Type, 
  Image, 
  Video, 
  Layout, 
  MousePointer2, 
  Heading, 
  Text,
  Plus,
  Trash2,
  Move,
  Copy,
  Settings
} from "lucide-react"

interface PageElement {
  id: string
  type: 'text' | 'heading' | 'image' | 'video' | 'button' | 'spacer' | 'divider'
  content: string
  styles: Record<string, string>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface PageBuilderProps {
  content: string
  onChange: (content: string) => void
  onClose: () => void
}

export default function PageBuilder({ content, onChange, onClose }: PageBuilderProps) {
  const [elements, setElements] = useState<PageElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const elementTypes = [
    { type: 'heading', icon: Heading, label: 'Heading', color: 'bg-blue-500' },
    { type: 'text', icon: Type, label: 'Text', color: 'bg-green-500' },
    { type: 'image', icon: Image, label: 'Image', color: 'bg-purple-500' },
    { type: 'video', icon: Video, label: 'Video', color: 'bg-red-500' },
    { type: 'button', icon: MousePointer2, label: 'Button', color: 'bg-orange-500' },
    { type: 'spacer', icon: Layout, label: 'Spacer', color: 'bg-gray-500' },
    { type: 'divider', icon: Text, label: 'Divider', color: 'bg-indigo-500' },
  ]

  const addElement = (type: PageElement['type']) => {
    const newElement: PageElement = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: { x: 50, y: 50 },
      size: { width: 300, height: 100 }
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const getDefaultContent = (type: PageElement['type']): string => {
    switch (type) {
      case 'heading': return '<h2>New Heading</h2>'
      case 'text': return '<p>Add your text here...</p>'
      case 'image': return '<img src="/placeholder.jpg" alt="Image" style="max-width: 100%; height: auto;" />'
      case 'video': return '<video controls style="max-width: 100%; height: auto;"><source src="" type="video/mp4"></video>'
      case 'button': return '<button>Click Me</button>'
      case 'spacer': return '<div style="height: 50px;"></div>'
      case 'divider': return '<hr style="border: 1px solid #ddd;">'
      default: return ''
    }
  }

  const getDefaultStyles = (type: PageElement['type']): Record<string, string> => {
    switch (type) {
      case 'heading': return { fontSize: '24px', fontWeight: 'bold', color: '#333' }
      case 'text': return { fontSize: '16px', color: '#666', lineHeight: '1.6' }
      case 'button': return { 
        backgroundColor: '#4fdce5', 
        color: 'white', 
        padding: '10px 20px', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer'
      }
      default: return {}
    }
  }

  const updateElement = (id: string, updates: Partial<PageElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id)
    if (element) {
      const newElement = {
        ...element,
        id: Date.now().toString(),
        position: { x: element.position.x + 20, y: element.position.y + 20 }
      }
      setElements([...elements, newElement])
    }
  }

  const renderElement = (element: PageElement) => {
    const isSelected = selectedElement === element.id
    const elementStyle = {
      position: 'absolute' as const,
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      minHeight: `${element.size.height}px`,
      border: isSelected ? '2px solid #4fdce5' : '1px solid transparent',
      cursor: 'move',
      ...element.styles
    }

    return (
      <div
        key={element.id}
        style={elementStyle}
        onClick={() => setSelectedElement(element.id)}
        className="group"
      >
        <div dangerouslySetInnerHTML={{ __html: element.content }} />
        
        {isSelected && (
          <div className="absolute -top-8 left-0 flex space-x-1 bg-white border border-gray-300 rounded shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation()
                duplicateElement(element.id)
              }}
              className="p-1 hover:bg-gray-100"
              title="Duplicate"
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteElement(element.id)
              }}
              className="p-1 hover:bg-gray-100 text-red-600"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
      <div className="bg-white w-80 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Page Builder</h3>
          <p className="text-sm text-gray-600">Drag elements to build your page</p>
        </div>

        {/* Element Library */}
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Elements</h4>
          <div className="grid grid-cols-2 gap-2">
            {elementTypes.map((elementType) => (
              <button
                key={elementType.type}
                onClick={() => addElement(elementType.type as PageElement['type'])}
                className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${elementType.color} mb-2`}>
                  <elementType.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-gray-700">{elementType.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Convert elements to HTML and save
                const html = elements.map(el => el.content).join('')
                onChange(html)
                onClose()
              }}
              className="flex-1 bg-[#4fdce5] text-white px-4 py-2 rounded-lg hover:bg-[#3cc9d3] transition-colors"
            >
              Save Page
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold">Canvas</h3>
        </div>
        
        <div className="flex-1 relative overflow-auto bg-gray-100">
          <div
            ref={canvasRef}
            className="relative w-full h-full min-h-screen bg-white"
            style={{ minHeight: '600px' }}
          >
            {elements.map(renderElement)}
            
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Layout className="h-12 w-12 mx-auto mb-4" />
                  <p>Start building your page by adding elements from the sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Element Properties Panel */}
      {selectedElement && (
        <div className="w-80 border-l border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold">Element Properties</h4>
          </div>
          
          <div className="p-4 space-y-4">
            {(() => {
              const element = elements.find(el => el.id === selectedElement)
              if (!element) return null

              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={element.content}
                      onChange={(e) => updateElement(element.id, { content: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={element.size.width}
                      onChange={(e) => updateElement(element.id, { 
                        size: { ...element.size, width: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={element.size.height}
                      onChange={(e) => updateElement(element.id, { 
                        size: { ...element.size, height: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  {element.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={element.styles.fontSize || ''}
                          onChange={(e) => updateElement(element.id, { 
                            styles: { ...element.styles, fontSize: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                          type="color"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={element.styles.color || '#000000'}
                          onChange={(e) => updateElement(element.id, { 
                            styles: { ...element.styles, color: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}

                  {element.type === 'button' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                        <input
                          type="color"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={element.styles.backgroundColor || '#4fdce5'}
                          onChange={(e) => updateElement(element.id, { 
                            styles: { ...element.styles, backgroundColor: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                        <input
                          type="color"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={element.styles.color || '#ffffff'}
                          onChange={(e) => updateElement(element.id, { 
                            styles: { ...element.styles, color: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
