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
  Circle
} from "lucide-react"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

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

interface QuillPageEditorProps {
  page: Page
  onSave: (updatedPage: Partial<Page>) => Promise<void>
  onCancel: () => void
}

export default function QuillPageEditor({ 
  page, 
  onSave, 
  onCancel 
}: QuillPageEditorProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState(page.content || "")
  const [title, setTitle] = useState(page.title || "")
  const [metaTitle, setMetaTitle] = useState(page.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(page.metaDescription || "")
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState("")
  const quillRef = useRef<any>(null)

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
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      const columnWidth = Math.floor(100 / columns)
      const columnHtml = Array.from({ length: columns }, (_, i) => 
        `<div class="column" style="width: ${columnWidth}%; float: left; padding: 0 10px; box-sizing: border-box;">
          <p>Column ${i + 1} content</p>
        </div>`
      ).join('')
      
      const clearfix = '<div style="clear: both;"></div>'
      const fullColumnHtml = `<div class="columns-container">${columnHtml}${clearfix}</div>`
      
      const range = quill.getSelection()
      quill.clipboard.dangerouslyPasteHTML(range?.index || 0, fullColumnHtml)
    }
  }

  const insertSection = (type: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      let sectionHtml = ""
      
      switch (type) {
        case "hero":
          sectionHtml = `
            <section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
              <h1 style="font-size: 3rem; margin-bottom: 20px;">Hero Title</h1>
              <p style="font-size: 1.2rem; margin-bottom: 30px;">Hero subtitle or description</p>
              <button style="background: #4fdce5; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Call to Action</button>
            </section>
          `
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
            </section>
          `
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
            </section>
          `
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
            </section>
          `
          break
      }
      
      const range = quill.getSelection()
      quill.clipboard.dangerouslyPasteHTML(range?.index || 0, sectionHtml)
    }
  }

  const insertTable = (rows: number, cols: number) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
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
      
      const range = quill.getSelection()
      quill.clipboard.dangerouslyPasteHTML(range?.index || 0, tableHtml)
    }
  }

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
              onClick={handlePreview}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
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

            {/* Quick Actions */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              
              <div className="space-y-1">
                <button
                  onClick={() => quillRef.current?.getEditor()?.history.undo()}
                  className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left flex items-center"
                >
                  <Undo className="h-3 w-3 mr-1" />
                  Undo
                </button>
                <button
                  onClick={() => quillRef.current?.getEditor()?.history.redo()}
                  className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left flex items-center"
                >
                  <Redo className="h-3 w-3 mr-1" />
                  Redo
                </button>
                <button
                  onClick={() => quillRef.current?.getEditor()?.format('clear')}
                  className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left flex items-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Format
                </button>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {isPreview ? (
              <div className="flex-1 p-6 overflow-auto bg-white">
                <div 
                  className="prose max-w-none"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#333'
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <div className="flex-1">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  style={{ height: '100%' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
