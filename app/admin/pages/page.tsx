"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
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
  X,
  AlertTriangle
} from "lucide-react"
// Frontend editor is now integrated into public pages

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
  updatedBy?: string
}

export default function PagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [pageToEdit, setPageToEdit] = useState<Page | null>(null)

  // Check user permissions
  const canView = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)
  const canEdit = session?.user?.role && ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)
  const canDelete = session?.user?.role && ["SUPER_ADMIN", "ADMIN"].includes(session.user.role)

  useEffect(() => {
    if (status === "loading") return
    if (!canView) {
      router.push('/auth/signin')
      return
    }
    fetchPages()
  }, [status, canView, router])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      } else {
        setError('Failed to fetch pages')
      }
    } catch (error) {
      setError('Error fetching pages')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (page: Page) => {
    window.open(`/${page.slug}`, '_blank')
  }

  const handleEdit = (page: Page) => {
    setPageToEdit(page)
    setShowEditor(true)
  }

  const handleEditorSave = async (updatedPage: Partial<Page>) => {
    if (!pageToEdit) return
    
    try {
      const response = await fetch(`/api/pages/${pageToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPage),
      })
      
      if (response.ok) {
        // Update the page in the local state
        setPages(pages.map(p => 
          p.id === pageToEdit.id 
            ? { ...p, ...updatedPage, updatedAt: new Date().toISOString() }
            : p
        ))
        setShowEditor(false)
        setPageToEdit(null)
      } else {
        throw new Error('Failed to update page')
      }
    } catch (error) {
      throw error
    }
  }

  const handleEditorCancel = () => {
    setShowEditor(false)
    setPageToEdit(null)
  }

  const handleDeleteClick = (page: Page) => {
    setPageToDelete(page)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setPages(pages.filter(p => p.id !== pageToDelete.id))
        setShowDeleteModal(false)
        setPageToDelete(null)
      } else {
        setError('Failed to delete page')
      }
    } catch (error) {
      setError('Error deleting page')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setPageToDelete(null)
  }

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "published" && page.isPublished) ||
                         (filterStatus === "draft" && !page.isPublished)
    return matchesSearch && matchesFilter
  })

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4fdce5]"></div>
      </div>
    )
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600">Manage your website pages</p>
        </div>
        <button className="px-4 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors">
          <Plus className="h-4 w-4 mr-2 inline" />
          New Page
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search pages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Pages</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
            <p className="text-gray-600">Create your first page to get started.</p>
          </div>
        ) : (
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
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {page.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            /{page.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        page.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.updatedBy || page.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {canView && (
                          <button 
                            onClick={() => handleView(page)}
                            className="text-[#4fdce5] hover:text-[#3cc9d3] p-1 rounded hover:bg-gray-100"
                            title="View Page"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {canEdit && (
                          <button 
                            onClick={() => handleEdit(page)}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                            title="Edit Page"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            onClick={() => handleDeleteClick(page)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100"
                            title="Delete Page"
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && pageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Page</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the page <strong>"{pageToDelete.title}"</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Frontend Editor Info */}
      {showEditor && pageToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frontend Editing</h2>
              <p className="text-gray-600 mb-6">
                To edit this page, visit the public page and click the edit button in the top-right corner.
                The edit button is only visible when logged in as an admin user.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 font-medium">
                  Visit: <a href={`/${pageToEdit.slug}`} target="_blank" rel="noopener noreferrer" className="underline">
                    /{pageToEdit.slug}
                  </a>
                </p>
              </div>
              <button
                onClick={handleEditorCancel}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}