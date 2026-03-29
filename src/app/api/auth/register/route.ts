import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    if (!firstName || !email || !password)
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })

    if (password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    const exists = await db.user.findUnique({ where: { email } })
    if (exists)
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 12)
    const user   = await db.user.create({
      data: { firstName, lastName: lastName ?? null, email, password: hashed },
      select: { id: true, firstName: true, lastName: true, email: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
