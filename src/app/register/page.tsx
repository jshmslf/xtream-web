'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserAvatar from '@/components/UserAvatar'

interface FormState {
  firstName: string
  lastName:  string
  email:     string
  password:  string
  confirm:   string
}

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm]       = useState<FormState>({
    firstName: '', lastName: '', email: '', password: '', confirm: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    // Register
    const res = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim() || null,
        email:     form.email.trim().toLowerCase(),
        password:  form.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setLoading(false)
      setError(data.error ?? 'Something went wrong')
      return
    }

    // Auto sign in after register
    const signInRes = await signIn('credentials', {
      email:    form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (signInRes?.error) {
      setError('Account created but sign in failed. Please log in.')
      router.push('/login')
      return
    }

    router.push('/')
    router.refresh()
  }

  // Live avatar preview
  const previewFirst = form.firstName || '?'
  const previewLast  = form.lastName  || null

  return (
    <main style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px', letterSpacing: '4px', color: '#E24B4A',
          }}>
            STREAMVAULT
          </span>
          <p style={{ color: '#8884a0', fontSize: '14px', marginTop: '6px' }}>
            Create your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#13131a',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '2rem',
        }}>

          {/* Avatar preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.75rem' }}>
            <UserAvatar
              firstName={previewFirst}
              lastName={previewLast}
              size={52}
            />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#f0eff5', margin: 0 }}>
                {form.firstName
                  ? [form.firstName, form.lastName].filter(Boolean).join(' ')
                  : 'Your name'}
              </p>
              <p style={{ fontSize: '12px', color: '#8884a0', marginTop: '2px' }}>
                Avatar preview
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  First name <span style={{ color: '#E24B4A' }}>*</span>
                </label>
                <input
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Last name</label>
                <input
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="dela Cruz"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>
                Email <span style={{ color: '#E24B4A' }}>*</span>
              </label>
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
              <label style={labelStyle}>
                Password <span style={{ color: '#E24B4A' }}>*</span>
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                style={inputStyle}
              />
            </div>

            {/* Confirm password */}
            <div>
              <label style={labelStyle}>
                Confirm password <span style={{ color: '#E24B4A' }}>*</span>
              </label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            {/* Password match indicator */}
            {form.confirm && (
              <p style={{
                fontSize: '12px', marginTop: '-4px',
                color: form.password === form.confirm ? '#1D9E75' : '#E24B4A',
              }}>
                {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}

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
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#8884a0' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#E24B4A', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
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