"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Euro, Filter, Search } from "lucide-react"

interface Booking {
  id: string
  studio: string
  user: string
  date: string
  startTime: string
  duration: number
  totalCost: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  addons: string[]
  notes?: string
  createdAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setBookings([
      {
        id: "1",
        studio: "Studio XL",
        user: "John Doe",
        date: "2024-01-15",
        startTime: "14:00",
        duration: 4,
        totalCost: 480,
        status: "CONFIRMED",
        addons: ["Professional Engineer", "Additional Equipment"],
        notes: "Recording drums and bass",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "2",
        studio: "Studio S",
        user: "Jane Smith",
        date: "2024-01-16",
        startTime: "10:00",
        duration: 2,
        totalCost: 160,
        status: "PENDING",
        addons: [],
        notes: "Vocal recording session",
        createdAt: "2024-01-11T14:30:00Z"
      },
      {
        id: "3",
        studio: "Studio XL",
        user: "Mike Johnson",
        date: "2024-01-17",
        startTime: "16:00",
        duration: 6,
        totalCost: 720,
        status: "COMPLETED",
        addons: ["Producer Services", "Mixing & Mastering"],
        notes: "Full album production",
        createdAt: "2024-01-12T09:15:00Z"
      }
    ])
    setLoading(false)
  }, [])

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.studio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ))
  }

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED": return "bg-green-100 text-green-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "COMPLETED": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
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
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage studio bookings and reservations</p>
        </div>
        <button className="bg-[#4fdce5] text-white px-4 py-2 rounded-lg hover:bg-[#3cc9d3] transition-colors">
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search bookings..."
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
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
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
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-[#4fdce5] flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.user}</div>
                        <div className="text-sm text-gray-500">ID: {booking.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.studio}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{booking.date}</div>
                        <div className="text-sm text-gray-500">{booking.startTime}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{booking.duration}h</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Euro className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">€{booking.totalCost}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-[#4fdce5] hover:text-[#3cc9d3]"
                      >
                        View
                      </button>
                      {booking.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "CONFIRMED")}
                            className="text-green-600 hover:text-green-900"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User</label>
                    <p className="text-sm text-gray-900">{selectedBooking.user}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Studio</label>
                    <p className="text-sm text-gray-900">{selectedBooking.studio}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date</label>
                    <p className="text-sm text-gray-900">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Time</label>
                    <p className="text-sm text-gray-900">{selectedBooking.startTime}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-sm text-gray-900">{selectedBooking.duration} hours</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Cost</label>
                    <p className="text-sm text-gray-900">€{selectedBooking.totalCost}</p>
                  </div>
                </div>
                
                {selectedBooking.addons.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Add-ons</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedBooking.addons.map((addon, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {addon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedBooking.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
