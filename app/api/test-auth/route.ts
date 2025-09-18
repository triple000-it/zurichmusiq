import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({ 
      success: true, 
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null,
      message: "Auth test successful"
    })
  } catch (error) {
    console.error("Auth test error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Auth test failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
