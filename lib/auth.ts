import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  // Temporarily disable adapter for production testing
  // adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Simple hardcoded admin for testing
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
        const adminEmail = process.env.ADMIN_EMAIL || "admin@zurichmusiq.com"
        
        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return {
            id: "1",
            email: adminEmail,
            name: "Admin User",
            role: "SUPER_ADMIN",
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  }
}
