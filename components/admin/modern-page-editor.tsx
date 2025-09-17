"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react"
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Palette,
  Layout,
  Columns,
  Type,
  Heading1,
  Heading2,
  Heading3,
  X,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Square,
  Circle,
  Edit3,
  EyeOff
} from "lucide-react"

// Dynamically import the markdown editor
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Page {
  id: string
  slug: string
  title: string
  content: string
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
  updatedBy: string | null
}

interface ModernPageEditorProps {
  page: Page
  onSave: (updatedPage: Partial<Page>) => Promise<void>
  onCancel: () => void
}

export default function ModernPageEditor({ 
  page, 
  onSave, 
  onCancel 
}: ModernPageEditorProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState(page.content || "")
  const [title, setTitle] = useState(page.title || "")
  const [metaTitle, setMetaTitle] = useState(page.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(page.metaDescription || "")

  // Initialize content when page changes
  useEffect(() => {
    setContent(page.content || "")
    setTitle(page.title || "")
    setMetaTitle(page.metaTitle || "")
    setMetaDescription(page.metaDescription || "")
  }, [page])
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState("")
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Track changes
  useEffect(() => {
    const hasContentChanges = content !== (page.content || "")
    const hasTitleChanges = title !== (page.title || "")
    const hasMetaChanges = metaTitle !== (page.metaTitle || "") || 
                          metaDescription !== (page.metaDescription || "")
    
    setHasChanges(hasContentChanges || hasTitleChanges || hasMetaChanges)
  }, [content, title, metaTitle, metaDescription, page])

  const handleSave = async () => {
    if (!hasChanges) return
    
    setIsSaving(true)
    setError("")
    
    try {
      await onSave({
        title,
        content,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      })
      setHasChanges(false)
    } catch (err: any) {
      setError(err.message || "Failed to save page")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    setIsPreview(!isPreview)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const insertColumn = (columns: number) => {
    const columnWidth = Math.floor(100 / columns)
    const columnHtml = Array.from({ length: columns }, (_, i) => 
      `<div class="column" style="width: ${columnWidth}%; float: left; padding: 0 10px; box-sizing: border-box;">
        <p>Column ${i + 1} content</p>
      </div>`
    ).join('')
    
    const clearfix = '<div style="clear: both;"></div>'
    const fullColumnHtml = `<div class="columns-container">${columnHtml}${clearfix}</div>`
    
    if (editorMode === 'wysiwyg') {
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newContent = content.substring(0, start) + fullColumnHtml + content.substring(end)
        setContent(newContent)
      }
    } else {
      // For markdown mode, insert as HTML
      const start = textareaRef.current?.selectionStart || 0
      const end = textareaRef.current?.selectionEnd || 0
      const newContent = content.substring(0, start) + fullColumnHtml + content.substring(end)
      setContent(newContent)
    }
  }

  const insertSection = (type: string) => {
    let sectionHtml = ""
    
    switch (type) {
      case "hero":
        sectionHtml = `
<section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
  <h1 style="font-size: 3rem; margin-bottom: 20px;">Hero Title</h1>
  <p style="font-size: 1.2rem; margin-bottom: 30px;">Hero subtitle or description</p>
  <button style="background: #4fdce5; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Call to Action</button>
</section>`
        break
      case "features":
        sectionHtml = `
<section class="features-section" style="padding: 60px 20px; background: #f8f9fa; margin: 20px 0; border-radius: 10px;">
  <h2 style="text-align: center; margin-bottom: 50px; font-size: 2.5rem; color: #2c3e50;">Features</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
    <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
      <h3 style="color: #4fdce5; margin-bottom: 15px;">Feature 1</h3>
      <p>Feature description goes here</p>
    </div>
    <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
      <h3 style="color: #4fdce5; margin-bottom: 15px;">Feature 2</h3>
      <p>Feature description goes here</p>
    </div>
    <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
      <h3 style="color: #4fdce5; margin-bottom: 15px;">Feature 3</h3>
      <p>Feature description goes here</p>
    </div>
  </div>
</section>`
        break
      case "testimonials":
        sectionHtml = `
<section class="testimonials-section" style="padding: 60px 20px; background: #2c3e50; color: white; margin: 20px 0; border-radius: 10px;">
  <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
    <h2 style="margin-bottom: 50px; font-size: 2.5rem;">What Our Clients Say</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
      <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
        <p style="font-style: italic; margin-bottom: 20px; font-size: 1.1rem;">"Amazing service and quality work!"</p>
        <div style="font-weight: bold;">- Client Name</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
        <p style="font-style: italic; margin-bottom: 20px; font-size: 1.1rem;">"Professional and reliable team."</p>
        <div style="font-weight: bold;">- Client Name</div>
      </div>
    </div>
  </div>
</section>`
        break
      case "pricing":
        sectionHtml = `
<section class="pricing-section" style="padding: 60px 20px; background: #f8f9fa; margin: 20px 0; border-radius: 10px;">
  <h2 style="text-align: center; margin-bottom: 50px; font-size: 2.5rem; color: #2c3e50;">Pricing Plans</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto;">
    <div style="background: white; padding: 40px 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; position: relative;">
      <h3 style="color: #4fdce5; margin-bottom: 20px; font-size: 1.5rem;">Basic Plan</h3>
      <div style="font-size: 3rem; font-weight: bold; color: #2c3e50; margin-bottom: 20px;">$99<span style="font-size: 1rem; color: #666;">/month</span></div>
      <ul style="list-style: none; padding: 0; margin-bottom: 30px;">
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">Feature 1</li>
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">Feature 2</li>
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">Feature 3</li>
      </ul>
      <button style="background: #4fdce5; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; width: 100%;">Choose Plan</button>
    </div>
    <div style="background: white; padding: 40px 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; position: relative; border: 2px solid #4fdce5;">
      <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #4fdce5; color: white; padding: 5px 20px; border-radius: 20px; font-size: 0.9rem;">Most Popular</div>
      <h3 style="color: #4fdce5; margin-bottom: 20px; font-size: 1.5rem;">Pro Plan</h3>
      <div style="font-size: 3rem; font-weight: bold; color: #2c3e50; margin-bottom: 20px;">$199<span style="font-size: 1rem; color: #666;">/month</span></div>
      <ul style="list-style: none; padding: 0; margin-bottom: 30px;">
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">All Basic Features</li>
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">Advanced Feature 1</li>
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">Advanced Feature 2</li>
      </ul>
      <button style="background: #4fdce5; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; width: 100%;">Choose Plan</button>
    </div>
    <div style="background: white; padding: 40px 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; position: relative;">
      <h3 style="color: #4fdce5; margin-bottom: 20px; font-size: 1.5rem;">Enterprise Plan</h3>
      <div style="font-size: 3rem; font-weight: bold; color: #2c3e50; margin-bottom: 20px;">$399<span style="font-size: 1rem; color: #666;">/month</span></div>
      <ul style="list-style: none; padding: 0; margin-bottom: 30px;">
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">All Pro Features</li>
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">Enterprise Feature 1</li>
        <li style="padding: 10px 0; border-bottom: 1px solid #eee;">Enterprise Feature 2</li>
      </ul>
      <button style="background: #4fdce5; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; width: 100%;">Choose Plan</button>
    </div>
  </div>
</section>`
        break
    }
    
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + sectionHtml + content.substring(end)
      setContent(newContent)
    }
  }

  const insertTable = (rows: number, cols: number) => {
    let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">'
    
    for (let i = 0; i < rows; i++) {
      tableHtml += '<tr>'
      for (let j = 0; j < cols; j++) {
        const cellContent = i === 0 ? `Header ${j + 1}` : `Cell ${i}-${j + 1}`
        tableHtml += `<td style="border: 1px solid #ddd; padding: 12px; text-align: left;">${cellContent}</td>`
      }
      tableHtml += '</tr>'
    }
    
    tableHtml += '</table>'
    
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + tableHtml + content.substring(end)
      setContent(newContent)
    }
  }

  const formatText = (format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    let formattedText = selectedText
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`
        break
      case 'italic':
        formattedText = `<em>${selectedText}</em>`
        break
      case 'underline':
        formattedText = `<u>${selectedText}</u>`
        break
      case 'h1':
        formattedText = `<h1>${selectedText}</h1>`
        break
      case 'h2':
        formattedText = `<h2>${selectedText}</h2>`
        break
      case 'h3':
        formattedText = `<h3>${selectedText}</h3>`
        break
      case 'link':
        const url = prompt('Enter URL:')
        if (url) {
          formattedText = `<a href="${url}">${selectedText}</a>`
        } else {
          return
        }
        break
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <style jsx global>{`
        .editor-content * {
          color: #333 !important;
        }
        .editor-content h1,
        .editor-content h2,
        .editor-content h3,
        .editor-content h4,
        .editor-content h5,
        .editor-content h6 {
          color: #2c3e50 !important;
        }
        .editor-content p {
          color: #333 !important;
        }
        .editor-content a {
          color: #4fdce5 !important;
        }
        .editor-content .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
        }
        .editor-content .hero-section h1,
        .editor-content .hero-section h2,
        .editor-content .hero-section h3,
        .editor-content .hero-section p {
          color: white !important;
        }
        .editor-content .testimonials-section {
          background: #2c3e50 !important;
          color: white !important;
        }
        .editor-content .testimonials-section h1,
        .editor-content .testimonials-section h2,
        .editor-content .testimonials-section h3,
        .editor-content .testimonials-section p {
          color: white !important;
        }
      `}</style>
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Edit Page: {page.slug}</h2>
            {hasChanges && (
              <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditorMode(editorMode === 'wysiwyg' ? 'markdown' : 'wysiwyg')}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {editorMode === 'wysiwyg' ? <Code className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {editorMode === 'wysiwyg' ? 'Markdown' : 'WYSIWYG'}
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {isPreview ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center px-4 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Page Settings */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Page Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4fdce5]"
                    placeholder="Enter page title"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4fdce5]"
                    placeholder="SEO title"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4fdce5]"
                    placeholder="SEO description"
                  />
                </div>
              </div>
            </div>

            {/* Formatting Tools */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Formatting</h3>
              
              <div className="space-y-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => formatText('bold')}
                    className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Bold className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => formatText('italic')}
                    className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Italic className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => formatText('underline')}
                    className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Underline className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => formatText('h1')}
                    className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Heading1 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => formatText('h2')}
                    className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Heading2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => formatText('h3')}
                    className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                  >
                    <Heading3 className="h-3 w-3" />
                  </button>
                </div>
                
                <button
                  onClick={() => formatText('link')}
                  className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Link className="h-3 w-3 mr-1" />
                  Link
                </button>
              </div>
            </div>

            {/* Layout Tools */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Layout Tools</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Columns
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map(cols => (
                      <button
                        key={cols}
                        onClick={() => insertColumn(cols)}
                        className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {cols} Col
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tables
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { rows: 2, cols: 2, label: "2x2" },
                      { rows: 3, cols: 3, label: "3x3" },
                      { rows: 4, cols: 4, label: "4x4" },
                      { rows: 5, cols: 3, label: "5x3" }
                    ].map(table => (
                      <button
                        key={table.label}
                        onClick={() => insertTable(table.rows, table.cols)}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {table.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sections
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => insertSection("hero")}
                      className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                    >
                      Hero Section
                    </button>
                    <button
                      onClick={() => insertSection("features")}
                      className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                    >
                      Features Grid
                    </button>
                    <button
                      onClick={() => insertSection("testimonials")}
                      className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                    >
                      Testimonials
                    </button>
                    <button
                      onClick={() => insertSection("pricing")}
                      className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left"
                    >
                      Pricing Plans
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {isPreview ? (
              <div className="flex-1 p-6 overflow-auto bg-white">
                <div 
                  className="editor-content prose max-w-none"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#333'
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : editorMode === 'markdown' ? (
              <div className="flex-1">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  data-color-mode="light"
                  height="100%"
                />
              </div>
            ) : editorMode === 'wysiwyg' ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4">
                  <div 
                    className="editor-content w-full h-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4fdce5] overflow-auto"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#333',
                      minHeight: '400px',
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 p-4">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4fdce5] resize-none"
                  placeholder="Start writing your content here..."
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
