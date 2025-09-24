"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Building,
  Music,
  UserCog
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Studios", href: "/admin/studios", icon: Building },
  { name: "Services", href: "/admin/services", icon: Music },
  { name: "Projects", href: "/admin/projects", icon: Music },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white/10 backdrop-blur-md shadow-lg h-screen border-r border-white/20">
      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#4fdce5] text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
