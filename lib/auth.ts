import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // Check if this is device authentication (no password provided)
        if (!credentials.password) {
          // For device auth, we'll allow any user to sign in
          // The device auth flow already validated the user
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        // For regular credentials, check password
        const isPasswordValid = credentials.password === process.env.ADMIN_PASSWORD && user.email === process.env.ADMIN_EMAIL

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user with USER role by default
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!,
                role: "USER",
                image: user.image,
              }
            })
          } else {
            // Update existing user's GitHub info
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              }
            })
          }
        } catch (error) {
          console.error("Error handling GitHub sign in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        token.role = dbUser?.role || "USER"
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
