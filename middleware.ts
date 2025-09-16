import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only for users with admin roles
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "SUPER_ADMIN" || 
                 token?.role === "ADMIN" || 
                 token?.role === "MANAGER"
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}
