"use client"

import { useSession, signOut } from "next-auth/react"
import { User, LogOut } from "lucide-react"
import Image from "next/image"

export default function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Image
              src="/LOGO-ZURICHMUSIQ.png"
              alt="Zurich Musiq"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
              onError={(e) => {
                console.error("Failed to load logo:", e)
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '<h1 class="text-2xl font-bold text-gray-900">Zurich Musiq</h1>'
                }
              }}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{session?.user?.role?.toLowerCase()}</p>
              </div>
            </div>
            
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
