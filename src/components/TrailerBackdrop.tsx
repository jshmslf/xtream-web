'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Volume2, VolumeX, Pause, Play, ImageIcon, Film } from 'lucide-react'
import { imgUrl } from '@/lib/tmdb'

interface TrailerBackdropProps {
  trailerKey:   string | null
  backdropPath: string | null
  alt:          string
}

export default function TrailerBackdrop({ trailerKey, backdropPath, alt }: TrailerBackdropProps) {
  const [muted,      setMuted]      = useState(true)
  const [paused,     setPaused]     = useState(false)
  const [ready,      setReady]      = useState(false)
  const [showImage,  setShowImage]  = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Send postMessage commands to the YouTube iframe
  function postYT(cmd: string, args?: Record<string, unknown>) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: cmd, args: args ? [args] : [] }),
      '*'
    )
  }

  function toggleMute() {
    postYT(muted ? 'unMute' : 'mute')
    setMuted(v => !v)
  }

  function togglePause() {
    postYT(paused ? 'playVideo' : 'pauseVideo')
    setPaused(v => !v)
  }

  function toggleImage() {
    if (!showImage) postYT('pauseVideo')
    else if (!paused) postYT('playVideo')
    setShowImage(v => !v)
  }

  const src = trailerKey
    ? `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`
    : null

  return (
    <div style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>

      {/* Static backdrop */}
      {backdropPath && (
        <Image
          src={imgUrl(backdropPath, 'original')}
          alt={alt} fill priority
          style={{ objectFit: 'cover', objectPosition: 'top center', transition: 'opacity 0.8s', opacity: (ready && !showImage) ? 0 : 1 }}
        />
      )}

      {/* YouTube iframe */}
      {src && (
        <iframe
          ref={iframeRef}
          src={src}
          onLoad={() => setTimeout(() => setReady(true), 1200)}
          allow="autoplay; encrypted-media"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            border: 'none',
            transform: 'scale(1.15)',
            pointerEvents: 'none',
            opacity: (ready && !showImage) ? 1 : 0,
            transition: 'opacity 0.8s',
          }}
        />
      )}

      {/* Gradients */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,0.4) 60%, transparent 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.6) 0%, transparent 60%)', zIndex: 1 }} />

      {/* Controls — only show when trailer is available */}
      {src && ready && (
        <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', gap: '8px', zIndex: 2 }}>
          {/* Toggle image/video */}
          <button onClick={toggleImage} title={showImage ? 'Show video' : 'Show image'} style={controlStyle}>
            {showImage ? <Film size={14} /> : <ImageIcon size={14} />}
          </button>
          {/* Pause/play — only relevant when video is showing */}
          {!showImage && (
            <button onClick={togglePause} title={paused ? 'Play' : 'Pause'} style={controlStyle}>
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          )}
          {/* Mute/unmute — only relevant when video is showing */}
          {!showImage && (
            <button onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} style={controlStyle}>
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const controlStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '34px', height: '34px', borderRadius: '50%',
  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
  border: '0.5px solid rgba(255,255,255,0.2)',
  color: '#fff', cursor: 'pointer', transition: 'background 0.2s',
}
