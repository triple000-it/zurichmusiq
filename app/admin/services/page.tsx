"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Wrench, 
  Edit, 
  Trash2, 
  Plus, 
  DollarSign, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Music,
  Headphones,
  Mic,
  Settings
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: string
  features: string[]
  image: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminServicesPage() {
  const { data: session } = useSession()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    duration: '',
    features: [] as string[],
    image: '',
    isActive: true
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const servicesData = await response.json()
          setServices(servicesData)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const openServiceModal = (service: Service | null, mode: 'view' | 'edit' | 'create') => {
    setSelectedService(service)
    setModalMode(mode)
    
    if (service && (mode === 'edit' || mode === 'create')) {
      setEditForm({
        name: service.name || '',
        description: service.description || '',
        category: service.category || '',
        price: service.price || 0,
        duration: service.duration || '',
        features: service.features || [],
        image: service.image || '',
        isActive: service.isActive !== undefined ? service.isActive : true
      })
    } else if (mode === 'create') {
      setEditForm({
        name: '',
        description: '',
        category: '',
        price: 0,
        duration: '',
        features: [],
        image: '',
        isActive: true
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

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setEditForm(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }))
  }

  const saveService = async () => {
    setIsSaving(true)
    try {
      const url = modalMode === 'create' ? '/api/services' : `/api/services/${selectedService?.id}`
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const serviceData = await response.json()
        
        if (modalMode === 'create') {
          setServices([...services, serviceData])
        } else {
          setServices(services.map(service => 
            service.id === selectedService?.id ? serviceData : service
          ))
          setSelectedService(serviceData)
        }
        
        setModalMode('view')
      }
    } catch (error) {
      console.error('Error saving service:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const createService = () => {
    openServiceModal(null, 'create')
  }

  const openDeleteConfirm = (service: Service) => {
    setServiceToDelete(service)
    setShowDeleteConfirm(true)
  }

  const deleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setServices(services.filter(service => service.id !== serviceId))
        setShowDeleteConfirm(false)
        setServiceToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    if (!category) return <Wrench className="h-5 w-5 text-gray-500" />
    
    switch (category.toLowerCase()) {
      case 'recording':
        return <Mic className="h-5 w-5 text-red-500" />
      case 'mixing':
        return <Headphones className="h-5 w-5 text-blue-500" />
      case 'mastering':
        return <Settings className="h-5 w-5 text-green-500" />
      case 'production':
        return <Music className="h-5 w-5 text-purple-500" />
      default:
        return <Wrench className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    if (!category) return 'bg-gray-100 text-gray-800 border-gray-200'
    
    switch (category.toLowerCase()) {
      case 'recording':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'mixing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'mastering':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'production':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
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

  const isAdmin = session?.user?.role && ['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Manage all recording services, pricing, and features</p>
        </div>
        <button
          onClick={createService}
          className="px-4 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 text-center">
          <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first service.</p>
          <button
            onClick={createService}
            className="px-6 py-3 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            Create First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Service Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(service.category)}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openServiceModal(service, 'view')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Wrench className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openServiceModal(service, 'edit')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Service"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => openDeleteConfirm(service)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            </div>

            {/* Service Details */}
            <div className="p-6">
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#4fdce5]" />
                    <span className="text-lg font-bold text-[#4fdce5]">€ {service.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features</h4>
                <div className="space-y-2">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                  {service.features.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{service.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.isActive)}`}>
                  {getStatusIcon(service.isActive)}
                  <span className="ml-1">{service.isActive ? 'Active' : 'Inactive'}</span>
                </span>
                <div className="text-xs text-gray-500">
                  Updated: {new Date(service.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Service Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Create New Service' : 
                   modalMode === 'edit' ? 'Edit Service' : 'Service Details'}
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
              {selectedService && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                          {modalMode === 'edit' || modalMode === 'create' ? (
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => handleFormChange('name', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{selectedService.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          {modalMode === 'edit' || modalMode === 'create' ? (
                            <select
                              value={editForm.category}
                              onChange={(e) => handleFormChange('category', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                            >
                              <option value="">Select Category</option>
                              <option value="Recording">Recording</option>
                              <option value="Mixing">Mixing</option>
                              <option value="Mastering">Mastering</option>
                              <option value="Production">Production</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(selectedService.category)}
                              <span className="text-gray-900">{selectedService.category}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                          {modalMode === 'edit' || modalMode === 'create' ? (
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                            />
                          ) : (
                            <p className="text-gray-900 font-bold text-lg">€ {selectedService.price.toFixed(2).replace('.', ',')}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                          {modalMode === 'edit' || modalMode === 'create' ? (
                            <input
                              type="text"
                              value={editForm.duration}
                              onChange={(e) => handleFormChange('duration', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                              placeholder="e.g., 2-3 hours, Half day, etc."
                            />
                          ) : (
                            <p className="text-gray-900">{selectedService.duration}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          {modalMode === 'edit' || modalMode === 'create' ? (
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editForm.isActive}
                                onChange={(e) => handleFormChange('isActive', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-gray-700">Active</span>
                            </label>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedService.isActive)}`}>
                              {getStatusIcon(selectedService.isActive)}
                              <span className="ml-1">{selectedService.isActive ? 'Active' : 'Inactive'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                      {modalMode === 'edit' || modalMode === 'create' ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          rows={6}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4fdce5] focus:border-[#4fdce5] text-gray-900 bg-white"
                          placeholder="Describe the service in detail..."
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Features</h3>
                    {modalMode === 'edit' || modalMode === 'create' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            'Professional Equipment',
                            'Experienced Engineer',
                            'High-Quality Output',
                            'Fast Turnaround',
                            'Unlimited Revisions',
                            'Industry Standards',
                            'Creative Input',
                            'File Delivery',
                            'Consultation Included',
                            'Post-Production Support'
                          ].map((feature) => (
                            <label key={feature} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                              <input
                                type="checkbox"
                                checked={editForm.features.includes(feature)}
                                onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-gray-700">{feature}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedService.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                    {(modalMode === 'edit' || modalMode === 'create') && (
                      <>
                        <button
                          onClick={() => modalMode === 'create' ? setShowModal(false) : setModalMode('view')}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveService}
                          disabled={isSaving}
                          className="px-6 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              {modalMode === 'create' ? 'Create Service' : 'Save Changes'}
                            </>
                          )}
                        </button>
                      </>
                    )}
                    {modalMode === 'view' && (
                      <button
                        onClick={() => setModalMode('edit')}
                        className="px-6 py-2 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Service
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
      {showDeleteConfirm && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Service</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{serviceToDelete.name}</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setServiceToDelete(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteService(serviceToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
