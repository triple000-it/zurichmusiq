"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log("Admin layout - Status:", status, "Session:", session)
    
    if (status === "loading") return

    if (!session) {
      console.log("No session, redirecting to signin")
      router.push("/auth/signin")
      return
    }

    // Check if user has admin role
    if (!session.user?.role || !["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(session.user.role)) {
      console.log("User doesn't have admin role, redirecting to home")
      router.push("/")
      return
    }
    
    console.log("User has admin access")
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4fdce5]"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <AdminHeader />
      <div className="flex relative z-10">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
