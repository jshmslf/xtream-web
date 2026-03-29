'use client'
import Link from 'next/link'

interface HeroButtonsProps {
  watchUrl: string
  detailUrl: string
}

export default function HeroButtons({ watchUrl, detailUrl }: HeroButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Link href={watchUrl}>
        <button className="bg-accent" style={{
          color: '#fff',
          border: 'none', borderRadius: '8px',
          padding: '12px 28px', fontSize: '14px', fontWeight: 500,
          fontFamily: 'inherit', cursor: 'pointer',
        }}>
          ▶ Watch Now
        </button>
      </Link>
      <Link href={detailUrl}>
        <button style={{
          background: 'rgba(255,255,255,0.08)', color: '#f0eff5',
          border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '8px',
          padding: '12px 28px', fontSize: '14px',
          fontFamily: 'inherit', cursor: 'pointer',
        }}>
          ⓘ More Info
        </button>
      </Link>
    </div>
  )
}