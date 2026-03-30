'use client'
import Link from 'next/link'

interface HeroButtonsProps {
  watchUrl: string
}

export default function HeroButtons({ watchUrl }: HeroButtonsProps) {
  return (
    <Link href={watchUrl}>
      <button className="bg-accent" style={{
        color: '#fff', border: 'none', borderRadius: '8px',
        padding: '12px 28px', fontSize: '14px', fontWeight: 500,
        fontFamily: 'inherit', cursor: 'pointer',
      }}>
        ▶ Watch Now
      </button>
    </Link>
  )
}
