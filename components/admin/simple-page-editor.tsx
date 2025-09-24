"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Save, 
  Eye, 
  X,
  Check,
  AlertCircle
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

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

interface SimplePageEditorProps {
  page: Page
  onSave: (updatedPage: Partial<Page>) => Promise<void>
  onCancel: () => void
}

export default function SimplePageEditor({ 
  page, 
  onSave, 
  onCancel 
}: SimplePageEditorProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState(page.content || "")
  const [title, setTitle] = useState(page.title || "")
  const [metaTitle, setMetaTitle] = useState(page.metaTitle || "")
  const [metaDescription, setMetaDescription] = useState(page.metaDescription || "")
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState("")

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Page: {page.slug}</h2>
            <p className="text-sm text-gray-600">Last updated: {new Date(page.updatedAt).toLocaleString()}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreview}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPreview 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>{isPreview ? "Edit" : "Preview"}</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </button>
            
            <button
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {isPreview ? (
            /* Preview Mode */
            <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
              {/* Cosmic background effect */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
              </div>
              
              {/* Header */}
              <div className="relative z-20">
                <Header />
              </div>
              
              {/* Preview Content */}
              <div className="relative z-10 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
                <div className="max-w-6xl mx-auto">
                  {/* Page Title */}
                  <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
                      {title || 'Page Title'}
                    </h1>
                  </div>

                  {/* Page Content */}
                  <div 
                    className="prose prose-lg prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
              
              {/* Footer */}
              <div className="relative z-20">
                <Footer />
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="flex-1 flex">
              {/* Left Panel - Settings */}
              <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Enter page title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="SEO title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="SEO description"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Content Editor */}
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Content</h3>
                  <p className="text-sm text-gray-600">Write your page content in HTML format</p>
                </div>
                
                <div className="flex-1 p-6">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none text-gray-900 bg-white"
                    placeholder="Enter your HTML content here..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
