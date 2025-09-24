"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react'

interface Booking {
  id: string
  date: string
  startTime: string
  duration: number
  totalCost: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  notes: string
  addonServices: string[]
  createdAt: string
  updatedAt: string
  studio: {
    id: string
    name: string
    description: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminBookingsPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const bookingsData = await response.json()
          setBookings(bookingsData)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return bookings.filter(booking => 
      booking.date.split('T')[0] === dateString
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        ))
        setShowModal(false)
        setSelectedBooking(null)
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const deleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingId))
        setShowDeleteConfirm(false)
        setBookingToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const openBookingModal = (booking: Booking, mode: 'view' | 'edit' = 'view') => {
    setSelectedBooking(booking)
    setModalMode(mode)
    setShowModal(true)
  }

  const openDeleteConfirm = (booking: Booking) => {
    setBookingToDelete(booking)
    setShowDeleteConfirm(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'ALL' || booking.status === statusFilter
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4fdce5]"></div>
      </div>
    )
  }

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'ALL' || booking.status === statusFilter
  )

  const isAdmin = session?.user?.role && ['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage all studio bookings and their status</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'calendar' 
                ? 'bg-[#4fdce5] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Calendar
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'table' 
                ? 'bg-[#4fdce5] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Table
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === 'ALL' 
              ? 'bg-[#4fdce5] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === 'PENDING' 
              ? 'bg-[#4fdce5] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({bookings.filter(b => b.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === 'CONFIRMED' 
              ? 'bg-[#4fdce5] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confirmed ({bookings.filter(b => b.status === 'CONFIRMED').length})
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === 'COMPLETED' 
              ? 'bg-[#4fdce5] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed ({bookings.filter(b => b.status === 'COMPLETED').length})
        </button>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-24"></div>
                }

                const dayBookings = getBookingsForDate(day)
                const isToday = day.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={index}
                    className={`h-24 border border-gray-200 p-1 ${
                      isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map(booking => (
                        <div
                          key={booking.id}
                          onClick={() => openBookingModal(booking, 'view')}
                          className={`text-xs p-1 rounded cursor-pointer truncate ${
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                            booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.startTime} - {booking.studio.name}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Studio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{booking.id.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.studio.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.startTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.duration} hours
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      € {booking.totalCost},00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openBookingModal(booking, 'view')}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openBookingModal(booking, 'edit')}
                          className="text-green-600 hover:text-green-800"
                          title="Edit Booking"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => openDeleteConfirm(booking)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Booking"
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
      )}

      {/* Booking Management Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === 'view' ? 'View' : 'Edit'} Booking #{selectedBooking.id.slice(-8)}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedBooking(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6 mb-8">
              {/* Booking Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Studio</label>
                    <p className="text-gray-900 font-medium">{selectedBooking.studio.name}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.studio.description}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Information</label>
                    <p className="text-gray-900 font-medium">{selectedBooking.user.name}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedBooking.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-500">Start Time: {selectedBooking.startTime}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration & Cost</label>
                    <p className="text-gray-900 font-medium">{selectedBooking.duration} hours</p>
                    <p className="text-lg font-bold text-[#4fdce5]">€ {selectedBooking.totalCost},00</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      <span className="ml-2">{selectedBooking.status}</span>
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Created</label>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-900">{selectedBooking.notes || 'No notes provided'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add-on Services</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {selectedBooking.addonServices.length > 0 ? (
                        <ul className="space-y-1">
                          {selectedBooking.addonServices.map((service, index) => (
                            <li key={index} className="text-gray-900">• {service}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No add-on services</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end">
              {selectedBooking.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CONFIRMED')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline Booking
                  </button>
                </>
              )}
              
              {selectedBooking.status === 'CONFIRMED' && (
                <>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'COMPLETED')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Booking
                  </button>
                </>
              )}
              
              {isAdmin && (
                <button
                  onClick={() => openDeleteConfirm(selectedBooking)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Booking
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedBooking(null)
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && bookingToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Booking</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete booking #{bookingToDelete.id.slice(-8)}? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setBookingToDelete(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteBooking(bookingToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}