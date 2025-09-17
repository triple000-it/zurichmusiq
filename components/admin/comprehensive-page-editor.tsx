"use client"

import { useState, useEffect, useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
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
  AlertCircle
} from "lucide-react"

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

interface ComprehensivePageEditorProps {
  page: Page
  onSave: (updatedPage: Partial<Page>) => Promise<void>
  onCancel: () => void
}

export default function ComprehensivePageEditor({ 
  page, 
  onSave, 
  onCancel 
}: ComprehensivePageEditorProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState(page.content || "")
  const [title, setTitle] = useState(page.title || "")
  const [metaTitle, setMetaTitle] = useState(page.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(page.metaDescription || "")
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState("")
  const editorRef = useRef<any>(null)

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
    if (editorRef.current) {
      const columnWidth = Math.floor(100 / columns)
      const columnHtml = Array.from({ length: columns }, (_, i) => 
        `<div class="column" style="width: ${columnWidth}%; float: left; padding: 0 10px; box-sizing: border-box;">
          <p>Column ${i + 1} content</p>
        </div>`
      ).join('')
      
      const clearfix = '<div style="clear: both;"></div>'
      const fullColumnHtml = `<div class="columns-container">${columnHtml}${clearfix}</div>`
      
      editorRef.current.insertContent(fullColumnHtml)
    }
  }

  const insertSection = (type: string) => {
    if (editorRef.current) {
      let sectionHtml = ""
      
      switch (type) {
        case "hero":
          sectionHtml = `
            <section class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 3rem; margin-bottom: 20px;">Hero Title</h1>
              <p style="font-size: 1.2rem; margin-bottom: 30px;">Hero subtitle or description</p>
              <button style="background: #4fdce5; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Call to Action</button>
            </section>
          `
          break
        case "features":
          sectionHtml = `
            <section class="features-section" style="padding: 60px 20px; background: #f8f9fa;">
              <div style="max-width: 1200px; margin: 0 auto;">
                <h2 style="text-align: center; margin-bottom: 50px; font-size: 2.5rem;">Features</h2>
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
              </div>
            </section>
          `
          break
        case "testimonials":
          sectionHtml = `
            <section class="testimonials-section" style="padding: 60px 20px; background: #2c3e50; color: white;">
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
      }
      
      editorRef.current.insertContent(sectionHtml)
    }
  }

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
              
              <div className="space-y-2">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              
              <div className="space-y-1">
                <button
                  onClick={() => editorRef.current?.undo()}
                  className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left flex items-center"
                >
                  <Undo className="h-3 w-3 mr-1" />
                  Undo
                </button>
                <button
                  onClick={() => editorRef.current?.redo()}
                  className="w-full px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 text-left flex items-center"
                >
                  <Redo className="h-3 w-3 mr-1" />
                  Redo
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
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  value={content}
                  onEditorChange={handleContentChange}
                  init={{
                    height: "100%",
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'template',
                      'codesample', 'emoticons', 'pagebreak', 'nonbreaking', 'directionality',
                      'textcolor', 'colorpicker', 'textpattern', 'hr', 'paste', 'toc'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help | fullscreen | code | template | image | link | table | ' +
                      'charmap | emoticons | insertdatetime | media | hr | pagebreak | ' +
                      'nonbreaking | anchor | toc | searchreplace | visualblocks | ' +
                      'codesample | directionality | textpattern | wordcount',
                    content_style: `
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        font-size: 14px; 
                        line-height: 1.6; 
                        color: #333;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                      }
                      .columns-container { 
                        display: flex; 
                        gap: 20px; 
                        margin: 20px 0; 
                      }
                      .column { 
                        flex: 1; 
                        padding: 0 10px; 
                      }
                      .hero-section { 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 80px 20px; 
                        text-align: center; 
                        margin: 20px 0; 
                        border-radius: 10px;
                      }
                      .features-section { 
                        padding: 60px 20px; 
                        background: #f8f9fa; 
                        margin: 20px 0;
                        border-radius: 10px;
                      }
                      .testimonials-section { 
                        padding: 60px 20px; 
                        background: #2c3e50; 
                        color: white; 
                        margin: 20px 0;
                        border-radius: 10px;
                      }
                      h1, h2, h3, h4, h5, h6 { 
                        color: #2c3e50; 
                        margin-top: 30px; 
                        margin-bottom: 15px; 
                      }
                      p { 
                        margin-bottom: 15px; 
                      }
                      img { 
                        max-width: 100%; 
                        height: auto; 
                        border-radius: 5px; 
                      }
                      blockquote { 
                        border-left: 4px solid #4fdce5; 
                        padding-left: 20px; 
                        margin: 20px 0; 
                        font-style: italic; 
                        color: #666; 
                      }
                      .btn { 
                        background: #4fdce5; 
                        color: white; 
                        padding: 12px 24px; 
                        border: none; 
                        border-radius: 5px; 
                        cursor: pointer; 
                        text-decoration: none; 
                        display: inline-block; 
                        margin: 10px 5px; 
                      }
                      .btn:hover { 
                        background: #3cc9d3; 
                      }
                    `,
                    templates: [
                      {
                        title: 'Hero Section',
                        description: 'A full-width hero section with title, subtitle, and CTA button',
                        content: `
                          <section class="hero-section">
                            <h1>Your Hero Title</h1>
                            <p>Your hero subtitle or description goes here</p>
                            <a href="#" class="btn">Call to Action</a>
                          </section>
                        `
                      },
                      {
                        title: 'Features Grid',
                        description: 'A responsive grid of feature cards',
                        content: `
                          <section class="features-section">
                            <h2>Features</h2>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                              <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                <h3 style="color: #4fdce5;">Feature 1</h3>
                                <p>Feature description</p>
                              </div>
                              <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                <h3 style="color: #4fdce5;">Feature 2</h3>
                                <p>Feature description</p>
                              </div>
                              <div style="text-align: center; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                <h3 style="color: #4fdce5;">Feature 3</h3>
                                <p>Feature description</p>
                              </div>
                            </div>
                          </section>
                        `
                      }
                    ],
                    paste_data_images: true,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    file_picker_callback: function (callback, value, meta) {
                      if (meta.filetype === 'image') {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();
                        input.onchange = function () {
                          const file = (input as any).files[0];
                          const reader = new FileReader();
                          reader.onload = function () {
                            callback(reader.result as string, {
                              alt: file.name
                            });
                          };
                          reader.readAsDataURL(file);
                        };
                      }
                    }
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
