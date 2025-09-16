"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  Globe,
  Lock,
  Unlock,
  Layout,
  Settings
} from "lucide-react"
import PageBuilder from "@/components/admin/page-builder"
import RichTextEditor from "@/components/admin/rich-text-editor"
import EnhancedPageEditor from "@/components/admin/enhanced-page-editor"

interface Page {
  id: string
  slug: string
  title: string
  content: string
  metaTitle?: string
  metaDescription?: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export default function PagesPage() {
  const { data: session } = useSession()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Check user permissions
  const canCreate = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)
  const canEdit = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)
  const canDelete = session?.user?.role === "SUPER_ADMIN"

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      } else {
        console.error('Failed to fetch pages')
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || 
                         (statusFilter === "PUBLISHED" && page.isPublished) ||
                         (statusFilter === "DRAFT" && !page.isPublished)
    return matchesSearch && matchesStatus
  })

  const togglePublishStatus = async (id: string) => {
    try {
      const page = pages.find(p => p.id === id)
      if (!page) return

      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...page,
          isPublished: !page.isPublished
        }),
      })

      if (response.ok) {
        const updatedPage = await response.json()
        setPages(pages.map(p => p.id === id ? updatedPage : p))
      } else {
        console.error('Failed to update page status')
      }
    } catch (error) {
      console.error('Error updating page status:', error)
    }
  }

  const deletePage = async (id: string) => {
    if (!canDelete) return

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPages(pages.filter(page => page.id !== id))
      } else {
        const error = await response.json()
        console.error('Failed to delete page:', error)
        alert('Failed to delete page. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Error deleting page. Please try again.')
    }
  }

  const createNewPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      slug: "",
      title: "New Page",
      content: "<h1>New Page</h1><p>Start writing your content here...</p>",
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session?.user?.name || "Unknown",
      updatedBy: session?.user?.name || "Unknown"
    }
    setSelectedPage(newPage)
    setIsCreating(true)
    setShowEditor(true)
  }

  const editPage = (page: Page) => {
    setSelectedPage(page)
    setIsCreating(false)
    setShowEditor(true)
  }

  const openBuilder = (page: Page) => {
    setSelectedPage(page)
    setIsCreating(false)
    setShowBuilder(true)
  }

  const savePage = async (updatedPage: Page) => {
    try {
      const url = isCreating ? '/api/pages' : `/api/pages/${updatedPage.id}`
      const method = isCreating ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPage),
      })

      if (response.ok) {
        const savedPage = await response.json()
        
        if (isCreating) {
          setPages([...pages, savedPage])
        } else {
          setPages(pages.map(page => 
            page.id === updatedPage.id ? savedPage : page
          ))
        }
        
        setShowEditor(false)
        setShowBuilder(false)
        setSelectedPage(null)
        setIsCreating(false)
      } else {
        const error = await response.json()
        console.error('Failed to save page:', error)
        alert('Failed to save page. Please try again.')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Error saving page. Please try again.')
    }
  }

  const saveBuilderContent = (content: string) => {
    if (selectedPage) {
      const updatedPage = { ...selectedPage, content }
      savePage(updatedPage)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fdce5]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600">Manage website pages and content</p>
        </div>
        {canCreate && (
          <button 
            onClick={createNewPage}
            className="bg-[#4fdce5] text-white px-4 py-2 rounded-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Page
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4fdce5] focus:border-[#4fdce5]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#4fdce5] focus:border-[#4fdce5]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Pages</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-[#4fdce5] flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500">/{page.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {page.isPublished ? (
                        <>
                          <Globe className="h-4 w-4 text-green-500 mr-2" />
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{new Date(page.updatedAt).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{new Date(page.updatedAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{page.updatedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editPage(page)}
                        disabled={!canEdit}
                        className="text-[#4fdce5] hover:text-[#3cc9d3] disabled:text-gray-400 disabled:cursor-not-allowed"
                        title={canEdit ? "Edit page" : "No permission to edit"}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openBuilder(page)}
                        disabled={!canEdit}
                        className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title={canEdit ? "Page Builder" : "No permission to edit"}
                      >
                        <Layout className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Preview page"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => togglePublishStatus(page.id)}
                        disabled={!canEdit}
                        className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title={canEdit ? (page.isPublished ? "Unpublish" : "Publish") : "No permission to publish"}
                      >
                        {page.isPublished ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => deletePage(page.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete page"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Editor Modal */}
      {showEditor && selectedPage && (
        <EnhancedPageEditor
          page={selectedPage}
          onSave={savePage}
          onClose={() => {
            setShowEditor(false)
            setSelectedPage(null)
            setIsCreating(false)
          }}
        />
      )}

      {/* Page Builder Modal */}
      {showBuilder && selectedPage && (
        <PageBuilder
          content={selectedPage.content}
          onChange={saveBuilderContent}
          onClose={() => {
            setShowBuilder(false)
            setSelectedPage(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

// Page Editor Component
