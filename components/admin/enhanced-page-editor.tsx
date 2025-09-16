"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Video,
  Table,
  Eye,
  Code2,
  Save,
  X,
  Plus,
  Trash2
} from "lucide-react"

interface EnhancedPageEditorProps {
  page: {
    id: string
    title: string
    content: string
    slug: string
    metaTitle?: string
    metaDescription?: string
    isPublished: boolean
  }
  onSave: (page: any) => void
  onClose: () => void
}

export default function EnhancedPageEditor({ page, onSave, onClose }: EnhancedPageEditorProps) {
  const [editedPage, setEditedPage] = useState(page)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')
  const [viewMode, setViewMode] = useState<'visual' | 'html'>('visual')
  const [isSaving, setIsSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  // Process content to make text visible in editor
  const processContentForEditor = (content: string) => {
    if (!content) return content
    
    // Replace white text classes with dark text classes
    let processedContent = content
      .replace(/text-white/g, 'text-gray-900')
      .replace(/text-white\/80/g, 'text-gray-700')
      .replace(/text-white\/60/g, 'text-gray-600')
      .replace(/text-white\/40/g, 'text-gray-500')
      .replace(/text-gray-300/g, 'text-gray-600')
      .replace(/text-gray-400/g, 'text-gray-500')
    
    // Add inline styles to override any remaining white text
    processedContent = processedContent.replace(
      /style="([^"]*color:\s*white[^"]*)"/g,
      'style="$1; color: #111827 !important;"'
    )
    
    // Add global style override for any remaining white text
    processedContent = `<div style="color: #111827 !important; background: #ffffff !important;">${processedContent}</div>`
    
    return processedContent
  }

  useEffect(() => {
    if (editorRef.current && viewMode === 'visual') {
      const processedContent = processContentForEditor(editedPage.content)
      editorRef.current.innerHTML = processedContent
    }
  }, [editedPage.content, viewMode])

  const handleInput = () => {
    if (editorRef.current) {
      setEditedPage({...editedPage, content: editorRef.current.innerHTML})
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html)
    editorRef.current?.focus()
    handleInput()
  }

  const addContentBlock = (type: string) => {
    let html = ''
    switch (type) {
      case 'heading':
        html = '<h2 class="text-3xl font-bold text-gray-900 mb-4">New Heading</h2>'
        break
      case 'paragraph':
        html = '<p class="text-gray-700 mb-4">New paragraph text...</p>'
        break
      case 'project-card':
        html = `
          <div class="bg-gray-100 rounded-lg p-6 border border-gray-200 mb-4">
            <div class="aspect-square bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <span class="text-gray-600 text-sm">Project Image</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">New Project</h3>
            <p class="text-blue-600 font-medium mb-1">Artist Name</p>
            <p class="text-gray-600 text-sm mb-2">Genre • Year</p>
            <p class="text-gray-700 text-sm mb-4 leading-relaxed">Project description...</p>
            <div class="mb-4">
              <h4 class="text-gray-900 font-medium mb-2">Services Provided:</h4>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Service 1</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Service 2</span>
              </div>
            </div>
            <button class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300">
              View Details
            </button>
          </div>
        `
        break
      case 'statistics':
        html = `
          <div class="bg-gray-100 rounded-lg p-8 border border-gray-200 mb-4">
            <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Statistics</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div class="text-4xl font-bold text-blue-600 mb-2">100+</div>
                <div class="text-gray-700">Projects</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div class="text-gray-700">Artists</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div class="text-gray-700">Satisfaction</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-blue-600 mb-2">5+</div>
                <div class="text-gray-700">Years</div>
              </div>
            </div>
          </div>
        `
        break
    }

    if (html) {
      insertHTML(html)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedPage = {
        ...editedPage,
        updatedAt: new Date().toISOString(),
        updatedBy: "Current User"
      }
      onSave(updatedPage)
    } catch (error) {
      console.error('Error saving page:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Edit Page: {editedPage.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'content', name: 'Content', icon: Code2 },
              { id: 'seo', name: 'SEO', icon: Eye },
              { id: 'settings', name: 'Settings', icon: Code }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#4fdce5] text-[#4fdce5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900"
                  value={editedPage.title}
                  onChange={(e) => setEditedPage({...editedPage, title: e.target.value})}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Page Content</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('visual')}
                      className={`px-3 py-1 text-sm rounded ${
                        viewMode === 'visual' 
                          ? 'bg-[#4fdce5] text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Visual
                    </button>
                    <button
                      onClick={() => setViewMode('html')}
                      className={`px-3 py-1 text-sm rounded ${
                        viewMode === 'html' 
                          ? 'bg-[#4fdce5] text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      HTML
                    </button>
                  </div>
                </div>

                {viewMode === 'visual' ? (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap items-center gap-1">
                      {toolbarButtons.map((button, index) => (
                        <button
                          key={index}
                          onClick={() => execCommand(button.command, button.value)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                          title={button.title}
                        >
                          <button.icon className="h-4 w-4" />
                        </button>
                      ))}
                      
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      
                      <button
                        onClick={() => addContentBlock('heading')}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Add Heading"
                      >
                        <Heading2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => addContentBlock('paragraph')}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Add Paragraph"
                      >
                        <Code2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => addContentBlock('project-card')}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Add Project Card"
                      >
                        <Image className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => addContentBlock('statistics')}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Add Statistics"
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Editor */}
                    <div
                      ref={editorRef}
                      contentEditable
                      className="min-h-96 p-4 focus:outline-none"
                      onInput={handleInput}
                      style={{
                        minHeight: '400px',
                        lineHeight: '1.6',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                ) : (
                  <textarea
                    className="w-full min-h-96 p-4 border border-gray-300 rounded-lg focus:ring-[#4fdce5] focus:border-[#4fdce5] font-mono text-sm"
                    value={editedPage.content}
                    onChange={(e) => setEditedPage({...editedPage, content: e.target.value})}
                    style={{
                      minHeight: '400px',
                      lineHeight: '1.6',
                      color: '#111827',
                      backgroundColor: '#ffffff'
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900"
                  value={editedPage.metaTitle || ''}
                  onChange={(e) => setEditedPage({...editedPage, metaTitle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900"
                  rows={3}
                  value={editedPage.metaDescription || ''}
                  onChange={(e) => setEditedPage({...editedPage, metaDescription: e.target.value})}
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Slug</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900"
                  value={editedPage.slug}
                  onChange={(e) => setEditedPage({...editedPage, slug: e.target.value})}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  className="h-4 w-4 text-[#4fdce5] focus:ring-[#4fdce5] border-gray-300 rounded"
                  checked={editedPage.isPublished}
                  onChange={(e) => setEditedPage({...editedPage, isPublished: e.target.checked})}
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                  Published
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
