"use client"

import { useSession } from "next-auth/react"

export default function DebugSession() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="fixed top-4 left-4 bg-yellow-500 text-black p-2 rounded z-50">Loading session...</div>
  }

  if (!session) {
    return <div className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded z-50">No session</div>
  }

  return (
    <div className="fixed top-4 left-4 bg-green-500 text-white p-2 rounded z-50">
      Logged in as: {session.user?.email} ({session.user?.role})
    </div>
  )
}
