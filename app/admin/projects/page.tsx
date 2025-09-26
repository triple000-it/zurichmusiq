"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Music,
  Calendar,
  User,
  Tag,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import ImageUpload from '@/components/image-upload'

interface Project {
  id: string
  title: string
  artist: string
  genre: string
  year: string
  description: string
  image: string
  services: string[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    artist: '',
    genre: '',
    year: '',
    description: '',
    image: '',
    services: [] as string[],
    isPublished: true
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const projectsData = await response.json()
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const isAdmin = session?.user?.role && ['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)

  const openProjectModal = (project: Project | null, mode: 'view' | 'edit' | 'create') => {
    setSelectedProject(project)
    setModalMode(mode)
    
    if (project && (mode === 'edit' || mode === 'create')) {
      setEditForm({
        title: project.title || '',
        artist: project.artist || '',
        genre: project.genre || '',
        year: project.year || '',
        description: project.description || '',
        image: project.image || '',
        services: project.services || [],
        isPublished: project.isPublished !== undefined ? project.isPublished : true
      })
    } else if (mode === 'create') {
      setEditForm({
        title: '',
        artist: '',
        genre: '',
        year: '',
        description: '',
        image: '',
        services: [],
        isPublished: true
      })
    }
    
    setShowModal(true)
  }

  const handleFormChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceChange = (service: string, checked: boolean) => {
    setEditForm(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }))
  }

  const saveProject = async () => {
    if (!isAdmin) return

    setIsSaving(true)
    try {
      const url = modalMode === 'create' ? '/api/projects' : `/api/projects/${selectedProject?.id}`
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const savedProject = await response.json()
        
        if (modalMode === 'create') {
          setProjects(prev => [savedProject, ...prev])
        } else {
          setProjects(prev => prev.map(p => p.id === savedProject.id ? savedProject : p))
        }
        
        setShowModal(false)
        setSelectedProject(null)
      } else {
        console.error('Error saving project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const createProject = () => {
    openProjectModal(null, 'create')
  }

  const openDeleteConfirm = (project: Project) => {
    setProjectToDelete(project)
    setShowDeleteConfirm(true)
  }

  const deleteProject = async (projectId: string) => {
    if (!isAdmin) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        setShowDeleteConfirm(false)
        setProjectToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleEditorCancel = () => {
    setShowModal(false)
    setSelectedProject(null)
  }

  const getStatusIcon = (isPublished: boolean) => {
    return isPublished ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 
      'bg-green-100 text-green-800' : 
      'bg-red-100 text-red-800'
  }

  const availableServices = [
    "Professional Recording",
    "Mixing & Mastering", 
    "Audio Mastering",
    "Music Production",
    "Remix Services",
    "Vocal Production",
    "Instrumental Production",
    "Podcast Production",
    "Sound Design",
    "Artist Development"
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4fdce5]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage all music projects and portfolio pieces</p>
        </div>
        {isAdmin && (
          <button
            onClick={createProject}
            className="flex items-center gap-2 px-4 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
          <p className="text-gray-500">Start by creating your first project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Project Image */}
            <div className="relative h-48">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder.jpg'
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.isPublished)}`}>
                  {getStatusIcon(project.isPublished)}
                  <span className="ml-1">{project.isPublished ? 'Published' : 'Draft'}</span>
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="h-4 w-4" />
                    <span>{project.artist}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>{project.genre}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openProjectModal(project, 'view')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openProjectModal(project, 'edit')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(project)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">{project.description}</p>

              {/* Services */}
              <div className="flex flex-wrap gap-1">
                {project.services.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#4fdce5]/10 text-[#4fdce5]"
                  >
                    {service}
                  </span>
                ))}
                {project.services.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    +{project.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Create New Project' : 
                   modalMode === 'edit' ? 'Edit Project' : 'Project Details'}
                </h2>
                <button
                  onClick={handleEditorCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      {modalMode === 'edit' || modalMode === 'create' ? (
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{selectedProject.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                      {modalMode === 'edit' || modalMode === 'create' ? (
                        <input
                          type="text"
                          value={editForm.artist}
                          onChange={(e) => handleFormChange('artist', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedProject.artist}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        {modalMode === 'edit' || modalMode === 'create' ? (
                          <input
                            type="text"
                            value={editForm.genre}
                            onChange={(e) => handleFormChange('genre', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                          />
                        ) : (
                          <p className="text-gray-900">{selectedProject.genre}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        {modalMode === 'edit' || modalMode === 'create' ? (
                          <input
                            type="text"
                            value={editForm.year}
                            onChange={(e) => handleFormChange('year', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                          />
                        ) : (
                          <p className="text-gray-900">{selectedProject.year}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                      {modalMode === 'edit' || modalMode === 'create' ? (
                        <ImageUpload
                          currentImage={editForm.image}
                          onImageChange={(imagePath) => handleFormChange('image', imagePath)}
                          type="project"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          {selectedProject.image ? (
                            <img
                              src={selectedProject.image}
                              alt={selectedProject.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500"><span>No image</span></div>'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <span>No image</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      {modalMode === 'edit' || modalMode === 'create' ? (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.isPublished}
                            onChange={(e) => handleFormChange('isPublished', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-gray-700">Published</span>
                        </label>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedProject.isPublished)}`}>
                          {getStatusIcon(selectedProject.isPublished)}
                          <span className="ml-1">{selectedProject.isPublished ? 'Published' : 'Draft'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description and Services */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                    {modalMode === 'edit' || modalMode === 'create' ? (
                      <textarea
                        value={editForm.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        rows={6}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                        placeholder="Describe the project in detail..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
                    )}
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Used</h3>
                    {modalMode === 'edit' || modalMode === 'create' ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {availableServices.map((service) => (
                          <label key={service} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.services.includes(service)}
                              onChange={(e) => handleServiceChange(service, e.target.checked)}
                              className="mr-3 rounded border-gray-300 text-[#4fdce5] focus:ring-[#4fdce5]"
                            />
                            <span className="text-gray-700">{service}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.services.map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#4fdce5]/10 text-[#4fdce5]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {(modalMode === 'edit' || modalMode === 'create') && isAdmin && (
              <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={handleEditorCancel}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProject}
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && !selectedProject && modalMode === 'create' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <button
                  onClick={handleEditorCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                      <input
                        type="text"
                        value={editForm.artist}
                        onChange={(e) => handleFormChange('artist', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                        placeholder="Enter artist name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <input
                          type="text"
                          value={editForm.genre}
                          onChange={(e) => handleFormChange('genre', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                          placeholder="e.g., Electronic"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="text"
                          value={editForm.year}
                          onChange={(e) => handleFormChange('year', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                          placeholder="e.g., 2024"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                      <ImageUpload
                        currentImage={editForm.image}
                        onImageChange={(imagePath) => handleFormChange('image', imagePath)}
                        type="project"
                      />
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.isPublished}
                          onChange={(e) => handleFormChange('isPublished', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-gray-700">Published</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description and Services */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                      placeholder="Describe the project in detail..."
                    />
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Used</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableServices.map((service) => (
                        <label key={service} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.services.includes(service)}
                            onChange={(e) => handleServiceChange(service, e.target.checked)}
                            className="mr-3 rounded border-gray-300 text-[#4fdce5] focus:ring-[#4fdce5]"
                          />
                          <span className="text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {isAdmin && (
              <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={handleEditorCancel}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProject}
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && projectToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{projectToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProject(projectToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
