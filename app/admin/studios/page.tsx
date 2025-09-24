"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Building, 
  Edit, 
  Trash2, 
  Plus, 
  Clock, 
  Users, 
  DollarSign, 
  MapPin,
  Calendar,
  Settings,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Studio {
  id: string
  name: string
  description: string
  size: string
  capacity: string
  hourlyRate: number
  dailyRate: number
  weeklyRate: number
  features: string[]
  equipment: any
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminStudiosPage() {
  const { data: session } = useSession()
  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null)

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await fetch('/api/studios')
        if (response.ok) {
          const studiosData = await response.json()
          setStudios(studiosData)
        }
      } catch (error) {
        console.error('Error fetching studios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudios()
  }, [])

  const openStudioModal = (studio: Studio | null, mode: 'view' | 'edit' | 'create') => {
    setSelectedStudio(studio)
    setModalMode(mode)
    setShowModal(true)
  }

  const openDeleteConfirm = (studio: Studio) => {
    setStudioToDelete(studio)
    setShowDeleteConfirm(true)
  }

  const deleteStudio = async (studioId: string) => {
    try {
      const response = await fetch(`/api/studios/${studioId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setStudios(studios.filter(studio => studio.id !== studioId))
        setShowDeleteConfirm(false)
        setStudioToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting studio:', error)
    }
  }

  const formatEquipment = (equipment: any) => {
    if (!equipment) return []
    
    if (typeof equipment === 'object') {
      return Object.entries(equipment).map(([category, items]) => ({
        category,
        items: Array.isArray(items) ? items : [items]
      }))
    }
    
    return []
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 
      'bg-green-100 text-green-800' : 
      'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4fdce5]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Studio Management</h1>
          <p className="text-gray-600">Manage all recording studios, packages, and equipment</p>
        </div>
        <button
          onClick={() => openStudioModal(null, 'create')}
          className="px-4 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Studio
        </button>
      </div>

      {/* Studios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studios.map((studio) => (
          <div key={studio.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Studio Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{studio.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{studio.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {studio.size}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {studio.capacity}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openStudioModal(studio, 'view')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Building className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openStudioModal(studio, 'edit')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Studio"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(studio)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Studio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Studio Details */}
            <div className="p-6">
              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Pricing Packages</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Hourly Rate</div>
                    <div className="text-xl font-bold text-[#4fdce5]">€{studio.hourlyRate}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Daily Rate</div>
                    <div className="text-xl font-bold text-[#4fdce5]">€{studio.dailyRate}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Weekly Rate</div>
                    <div className="text-xl font-bold text-[#4fdce5]">€{studio.weeklyRate}</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {studio.features.map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipment Preview */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Equipment</h4>
                <div className="space-y-2">
                  {formatEquipment(studio.equipment).slice(0, 3).map((category, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-gray-700">{category.category}:</span>
                      <span className="text-gray-600 ml-2">
                        {category.items.slice(0, 2).join(', ')}
                        {category.items.length > 2 && ` +${category.items.length - 2} more`}
                      </span>
                    </div>
                  ))}
                  {formatEquipment(studio.equipment).length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{formatEquipment(studio.equipment).length - 3} more categories
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(studio.isActive)}`}>
                  {getStatusIcon(studio.isActive)}
                  <span className="ml-1">{studio.isActive ? 'Active' : 'Inactive'}</span>
                </span>
                <div className="text-xs text-gray-500">
                  Updated: {new Date(studio.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Studio Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Create New Studio' : 
                   modalMode === 'edit' ? 'Edit Studio' : 'Studio Details'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedStudio && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Studio Name</label>
                          <p className="text-gray-900 font-medium">{selectedStudio.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                          <p className="text-gray-900">{selectedStudio.size}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                          <p className="text-gray-900">{selectedStudio.capacity}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStudio.isActive)}`}>
                            {getStatusIcon(selectedStudio.isActive)}
                            <span className="ml-1">{selectedStudio.isActive ? 'Active' : 'Inactive'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedStudio.description}</p>
                    </div>
                  </div>

                  {/* Pricing Packages */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <div className="text-center">
                          <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Hourly Rate</h4>
                          <div className="text-3xl font-bold text-blue-600 mb-2">€{selectedStudio.hourlyRate}</div>
                          <p className="text-sm text-gray-600">Perfect for short sessions</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Daily Rate</h4>
                          <div className="text-3xl font-bold text-green-600 mb-2">€{selectedStudio.dailyRate}</div>
                          <p className="text-sm text-gray-600">Full day recording sessions</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                        <div className="text-center">
                          <Building className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Weekly Rate</h4>
                          <div className="text-3xl font-bold text-purple-600 mb-2">€{selectedStudio.weeklyRate}</div>
                          <p className="text-sm text-gray-600">Extended projects</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedStudio.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment & Gear</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formatEquipment(selectedStudio.equipment).map((category, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 capitalize">{category.category}</h4>
                          <ul className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-[#4fdce5] rounded-full"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  {selectedStudio.images && selectedStudio.images.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Studio Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedStudio.images.map((image, index) => (
                          <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={image} 
                              alt={`${selectedStudio.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                    {modalMode === 'view' && (
                      <button
                        onClick={() => setModalMode('edit')}
                        className="px-6 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Studio
                      </button>
                    )}
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && studioToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Studio</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{studioToDelete.name}</strong>? 
              This action cannot be undone and will remove all associated bookings.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setStudioToDelete(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStudio(studioToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
