"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { prisma } from "@/lib/prisma"
import { 
  Users, 
  Calendar, 
  Building, 
  Music, 
  TrendingUp,
  DollarSign,
  Clock
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalBookings: number
  totalStudios: number
  totalServices: number
  monthlyRevenue: number
  pendingBookings: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalStudios: 0,
    totalServices: 0,
    monthlyRevenue: 0,
    pendingBookings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    // For now, we'll use mock data
    setStats({
      totalUsers: 156,
      totalBookings: 89,
      totalStudios: 2,
      totalServices: 6,
      monthlyRevenue: 12500,
      pendingBookings: 12
    })
    setLoading(false)
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-green-500",
      change: "+8%"
    },
    {
      title: "Active Studios",
      value: stats.totalStudios,
      icon: Building,
      color: "bg-purple-500",
      change: "0%"
    },
    {
      title: "Services",
      value: stats.totalServices,
      icon: Music,
      color: "bg-orange-500",
      change: "+2%"
    },
    {
      title: "Monthly Revenue",
      value: `€${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-500",
      change: "+15%"
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-red-500",
      change: "-5%"
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4fdce5]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session?.user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} from last month</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {[
              { id: 1, studio: "Studio XL", date: "2024-01-15", time: "14:00", status: "Confirmed" },
              { id: 2, studio: "Studio S", date: "2024-01-16", time: "10:00", status: "Pending" },
              { id: 3, studio: "Studio XL", date: "2024-01-17", time: "16:00", status: "Confirmed" },
            ].map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.studio}</p>
                  <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  booking.status === "Confirmed" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-[#4fdce5] text-white rounded-lg hover:bg-[#3cc9d3] transition-colors">
              Create New Booking
            </button>
            <button className="w-full text-left p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Add New User
            </button>
            <button className="w-full text-left p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Manage Studios
            </button>
            <button className="w-full text-left p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
