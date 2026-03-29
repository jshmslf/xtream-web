import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:        string
      firstName: string
      lastName:  string | null
      email:     string
      image:     string | null
    } & DefaultSession['user']
  }

  interface User {
    id:        string
    firstName: string
    lastName:  string | null
    email:     string
    image:     string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id:        string
    firstName: string
    lastName:  string | null
    image:     string | null
  }
}