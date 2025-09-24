"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

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
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600">Manage all studio bookings and their status</p>
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
          All Bookings
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === 'PENDING' 
              ? 'bg-[#4fdce5] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === 'CONFIRMED' 
              ? 'bg-[#4fdce5] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-4 py-2 rounded-lg font-medium ${
            statusFilter === 'COMPLETED' 
              ? 'bg-[#4fdce5] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Bookings Table */}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowModal(true)
                      }}
                      className="text-[#4fdce5] hover:text-[#3cc9d3]"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Management Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Manage Booking #{selectedBooking.id.slice(-8)}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Studio</label>
                  <p className="text-gray-900">{selectedBooking.studio.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client</label>
                  <p className="text-gray-900">{selectedBooking.user.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="text-gray-900">
                    {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.startTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-gray-900">{selectedBooking.duration} hours</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <p className="text-gray-900">{selectedBooking.notes || 'No notes provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Add-on Services</label>
                <p className="text-gray-900">
                  {selectedBooking.addonServices.length > 0 
                    ? selectedBooking.addonServices.join(', ') 
                    : 'None'
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              {selectedBooking.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CONFIRMED')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              
              {selectedBooking.status === 'CONFIRMED' && (
                <>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'COMPLETED')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedBooking(null)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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