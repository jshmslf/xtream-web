import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '0.5px solid rgba(255,255,255,0.07)',
      background: '#0a0a0f',
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
    }}>
      <Image src="/assets/logo_landscape.png" alt="StreamVault" width={130} height={26} />
      <p style={{ fontSize: '13px', color: '#8884a0' }}>
        Made by <span style={{ color: '#f0eff5', fontWeight: 500 }}>sh0t1mE</span>
      </p>
      <a
        href="mailto:nachtgrey@proton.me"
        className="footer-email"
        style={{ fontSize: '12px', color: '#8884a0', textDecoration: 'none' }}
      >
        nachtgrey@proton.me
      </a>

      <style>{`
        .footer-email:hover { color: #f0eff5; }
      `}</style>
    </footer>
  )
}
