import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db) as never,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error:  '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email    = credentials?.email    as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        const user = await db.user.findUnique({ where: { email } })

        if (!user?.password) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return {
          id:        user.id,
          firstName: user.firstName,
          lastName:  user.lastName ?? null,
          email:     user.email,
          image:     user.image    ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id        = user.id
        token.firstName = user.firstName
        token.lastName  = user.lastName  ?? null
        token.image     = user.image     ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id        = token.id        as string
        session.user.firstName = token.firstName as string
        session.user.lastName  = (token.lastName  as string | null) ?? null
        session.user.image     = (token.image     as string | null) ?? null
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data:  { updatedAt: new Date() },
        }).catch(() => {})
      }
    },
  },
})
