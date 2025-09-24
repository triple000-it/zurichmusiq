"use client"

import { useSession } from "next-auth/react"

export default function DebugSession() {
  const { data: session, status } = useSession()

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <h3 className="font-bold mb-2">Session Debug:</h3>
      <div>Status: <span className="text-yellow-400">{status}</span></div>
      {session ? (
        <>
          <div>User: <span className="text-green-400">{session.user?.name}</span></div>
          <div>Email: <span className="text-green-400">{session.user?.email}</span></div>
          <div>Role: <span className="text-green-400">{session.user?.role}</span></div>
          <div>Is Admin: <span className="text-green-400">
            {session.user?.role && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(session.user.role) ? 'YES' : 'NO'}
          </span></div>
        </>
      ) : (
        <div className="text-red-400">No session</div>
      )}
    </div>
  )
}
