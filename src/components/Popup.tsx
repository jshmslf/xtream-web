'use client'

import { X } from 'lucide-react'

interface PopupProps {
  message:     string
  onClose:     () => void
  closeLabel?: string
}

export default function Popup({ message, onClose, closeLabel = 'Close' }: PopupProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#13131a', border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', padding: '2rem', maxWidth: '380px', width: '100%',
          textAlign: 'center', position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#8884a0', display: 'flex', alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🚧</div>

        <p style={{ fontSize: '15px', color: '#f0eff5', fontWeight: 500, marginBottom: '0.5rem' }}>
          {message}
        </p>

        <p style={{ fontSize: '13px', color: '#8884a0', marginBottom: '1.5rem' }}>
          We&apos;re working on something great. Check back soon!
        </p>

        <button
          onClick={onClose}
          className="bg-accent"
          style={{
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '10px 28px', fontSize: '14px', fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer', width: '100%',
          }}
        >
          {closeLabel}
        </button>
      </div>
    </div>
  )
}
