"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Edit3, Save, X, Eye, EyeOff } from "lucide-react"

interface UniversalEditButtonProps {
  pageSlug: string
  pageTitle: string
}

export default function UniversalEditButton({ pageSlug, pageTitle }: UniversalEditButtonProps) {
  const { data: session, status } = useSession()
  const [isVisible, setIsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state
  const [title, setTitle] = useState(pageTitle)
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  
  // Check if user is admin
  const isAdmin = session?.user?.role && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role)
  
  // Debug logging
  useEffect(() => {
    console.log('UniversalEditButton Debug:', {
      status,
      session: session ? { user: session.user } : null,
      isAdmin,
      pageSlug,
      pageTitle
    })
  }, [status, session, isAdmin, pageSlug, pageTitle])
  
  // Show button after session is loaded
  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      console.log('Setting edit button visible for:', pageTitle)
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [status, isAdmin, pageTitle])

  // Don't render anything if user is not admin or not visible yet
  if (!isAdmin || !isVisible) {
    return null
  }

  const handleEdit = () => {
    setIsEditing(true)
    // Load current page content (placeholder for now)
    setContent(`<h2>Welcome to ${pageTitle}</h2><p>This is the content for the ${pageSlug} page. You can edit this content using the editor below.</p>`)
    setMetaTitle(`${pageTitle} - Zurich Musiq`)
    setMetaDescription(`Professional music recording studio - ${pageTitle}`)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    alert(`Page "${pageTitle}" saved successfully!`)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowPreview(false)
  }

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={handleEdit}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title={`Edit ${pageTitle}`}
      >
        <Edit3 className="h-5 w-5" />
      </button>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Page: {pageTitle}</h2>
                <p className="text-sm text-gray-600">Make changes to this page content</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    showPreview 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showPreview ? "Edit" : "Preview"}</span>
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {showPreview ? (
                /* Preview Mode */
                <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
                  {/* Cosmic background effect */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="relative z-10 w-full min-h-screen pt-32 pb-20 px-8 lg:px-16">
                    <div className="max-w-6xl mx-auto">
                      {/* Page Title */}
                      <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
                          {title || pageTitle}
                        </h1>
                      </div>

                      {/* Page Content */}
                      <div 
                        className="prose prose-lg prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
      )}
    </>
  )
}
