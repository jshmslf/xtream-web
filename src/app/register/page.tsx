'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import UserAvatar from '@/components/UserAvatar'

const GREEN = '#1DB954'

interface FormState {
  firstName: string
  lastName:  string
  email:     string
  password:  string
  confirm:   string
}

export default function RegisterPage() {
  const router = useRouter()

  const [form,      setForm]      = useState<FormState>({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [showPw,    setShowPw]    = useState(false)
  const [showConf,  setShowConf]  = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8)       { setError('Password must be at least 8 characters'); return }

    setLoading(true)

    const res  = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: form.firstName.trim(), lastName: form.lastName.trim() || null, email: form.email.trim().toLowerCase(), password: form.password }),
    })
    const data = await res.json()

    if (!res.ok) { setLoading(false); setError(data.error ?? 'Something went wrong'); return }

    const signInRes = await signIn('credentials', { email: form.email.trim().toLowerCase(), password: form.password, redirect: false })
    setLoading(false)

    if (signInRes?.error) { setError('Account created but sign in failed. Please log in.'); router.push('/login'); return }

    router.push('/')
    router.refresh()
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Image src="/assets/logo_landscape.png" alt="StreamVault" width={180} height={36} style={{ margin: '0 auto' }} priority />
          <p style={{ color: '#8884a0', fontSize: '14px', marginTop: '10px' }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{ background: '#13131a', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem' }}>

          {/* Avatar preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.75rem' }}>
            <UserAvatar firstName={form.firstName || '?'} lastName={form.lastName || null} size={52} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#f0eff5', margin: 0 }}>
                {form.firstName ? [form.firstName, form.lastName].filter(Boolean).join(' ') : 'Your name'}
              </p>
              <p style={{ fontSize: '12px', color: '#8884a0', marginTop: '2px' }}>Avatar preview</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>First name <span style={{ color: GREEN }}>*</span></label>
                <input name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="Juan" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last name</label>
                <input name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="dela Cruz" style={inputStyle} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email <span style={{ color: GREEN }}>*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle} />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password <span style={{ color: GREEN }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" required
                  style={{ ...inputStyle, paddingRight: '42px' }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={eyeBtn}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label style={labelStyle}>Confirm password <span style={{ color: GREEN }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  name="confirm" type={showConf ? 'text' : 'password'}
                  value={form.confirm} onChange={handleChange}
                  placeholder="••••••••" required
                  style={{ ...inputStyle, paddingRight: '42px' }}
                />
                <button type="button" onClick={() => setShowConf(v => !v)} style={eyeBtn}>
                  {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password match */}
            {form.confirm && (
              <p style={{ fontSize: '12px', marginTop: '-4px', color: form.password === form.confirm ? GREEN : '#e24b4a' }}>
                {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}

            {/* Error */}
            {error && (
              <p style={{ fontSize: '13px', color: '#e24b4a', background: 'rgba(226,75,74,0.08)', border: '0.5px solid rgba(226,75,74,0.2)', borderRadius: '8px', padding: '10px 12px' }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{ marginTop: '0.5rem', background: loading ? '#158a3e' : GREEN, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '15px', fontWeight: 500, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#8884a0' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: GREEN, textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>

      </div>
    </main>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', color: '#8884a0', marginBottom: '6px', fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#0a0a0f', border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', color: '#f0eff5', fontSize: '14px',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const eyeBtn: React.CSSProperties = {
  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer', color: '#8884a0',
  display: 'flex', alignItems: 'center',
}
