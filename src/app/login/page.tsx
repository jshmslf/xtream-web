'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email:    form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px', letterSpacing: '4px', color: '#E24B4A',
          }}>
            STREAMVAULT
          </span>
          <p style={{ color: '#8884a0', fontSize: '14px', marginTop: '6px' }}>
            Welcome back
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#13131a',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '2rem',
        }}>
          <h1 style={{
            fontSize: '20px', fontWeight: 600,
            color: '#f0eff5', marginBottom: '1.5rem',
          }}>
            Sign in
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            {/* Error */}
            {error && (
              <p style={{
                fontSize: '13px', color: '#E24B4A',
                background: 'rgba(226,75,74,0.08)',
                border: '0.5px solid rgba(226,75,74,0.2)',
                borderRadius: '8px', padding: '10px 12px',
              }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                background: loading ? '#6b2928' : '#E24B4A',
                color: '#fff', border: 'none', borderRadius: '10px',
                padding: '12px', fontSize: '15px', fontWeight: 500,
                fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#8884a0' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#E24B4A', textDecoration: 'none', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>

      </div>
    </main>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px',
  color: '#8884a0', marginBottom: '6px', fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#0a0a0f',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', color: '#f0eff5',
  fontSize: '14px', fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}