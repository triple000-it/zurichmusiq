import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-simple"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Add error handling
export async function GET(request: Request) {
  try {
    return await handler(request)
  } catch (error) {
    console.error("NextAuth GET error:", error)
    return new Response("Authentication error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    return await handler(request)
  } catch (error) {
    console.error("NextAuth POST error:", error)
    return new Response("Authentication error", { status: 500 })
  }
}
