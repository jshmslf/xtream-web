'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search, Settings, LogIn, LogOut, User,
  Bookmark, ChevronDown, History, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { imgUrl } from '@/lib/tmdb'
import UserAvatar from '@/components/UserAvatar'
import type { TMDBSearchResult } from '@/types/tmdb'

const NAV_LINKS = [
  { label: 'Home',         href: '/'          },
  { label: 'Movies',       href: '/movies'    },
  { label: 'TV Shows',     href: '/tv'        },
  { label: 'Anime',        href: '/anime'     },
  { label: 'My Favorites', href: '/favorites' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session, status } = useSession()

  const [scrolled,     setScrolled]     = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [query,        setQuery]        = useState('')
  const [suggestions,  setSuggestions]  = useState<TMDBSearchResult[]>([])
  const [suggesting,   setSuggesting]   = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchWrapRef = useRef<HTMLDivElement>(null)

  const user      = session?.user
  const isLoading = status === 'loading'

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setSearchOpen(false)
      setMenuOpen(false)
      setSuggestions([])
    }
  }

  function handleQueryChange(val: string) {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!val.trim()) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      setSuggesting(true)
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(val.trim())}&page=1`)
        const data = await res.json()
        setSuggestions((data.results ?? []).slice(0, 6))
      } finally {
        setSuggesting(false)
      }
    }, 300)
  }

  function closeSuggestions() {
    setTimeout(() => setSuggestions([]), 150)
  }

  function suggestionHref(item: TMDBSearchResult) {
    return item.media_type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`
  }

  function handleSignOut() {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || menuOpen
            ? 'bg-black/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-transparent'
        )}
        style={{
          background: scrolled || menuOpen
            ? undefined
            : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      >
        <div
          className="flex items-center justify-between gap-4"
          style={{ maxWidth: '1390px', margin: '0 auto', padding: '0 1.25rem', height: '64px' }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image src="/assets/logo_landscape.png" alt="StreamVault" height={28} width={140} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm transition-colors duration-150',
                    active ? 'text-white font-medium' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center" style={{ position: 'relative' }}>
              <div
                ref={searchWrapRef}
                className={cn(
                  'flex items-center gap-2 overflow-hidden transition-all duration-300 rounded-md',
                  searchOpen ? 'w-44 sm:w-64 bg-neutral-900 border border-neutral-700 px-3' : 'w-8'
                )}
                style={{ height: '36px' }}
              >
                <button
                  type="button"
                  onClick={() => setSearchOpen(v => !v)}
                  className="shrink-0 text-neutral-400 hover:text-white transition-colors"
                >
                  <Search size={16} />
                </button>
                {searchOpen && (
                  <input
                    autoFocus
                    value={query}
                    onChange={e => handleQueryChange(e.target.value)}
                    onBlur={closeSuggestions}
                    placeholder="Search titles..."
                    className="bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-500 w-full"
                  />
                )}
              </div>

              {/* Suggestions dropdown */}
              {searchOpen && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '44px', right: 0,
                  width: '320px', background: '#13131a',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                  zIndex: 100,
                }}>
                  {suggestions.map(item => {
                    const title = item.title ?? item.name ?? 'Untitled'
                    const year  = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
                    const type  = item.media_type === 'tv' ? 'TV' : 'Movie'
                    return (
                      <Link
                        key={item.id}
                        href={suggestionHref(item)}
                        onClick={() => { setSuggestions([]); setSearchOpen(false); setQuery('') }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '8px 12px', textDecoration: 'none', color: 'inherit',
                          transition: 'background 0.15s',
                        }}
                        className="hover:bg-white/5"
                      >
                        {/* Poster */}
                        <div style={{ flexShrink: 0, width: '32px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: '#1c1c27', position: 'relative' }}>
                          <Image src={imgUrl(item.poster_path, 'w92')} alt={title} fill style={{ objectFit: 'cover' }} />
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#f0eff5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
                          <p style={{ fontSize: '11px', color: '#8884a0', marginTop: '2px' }}>{year}</p>
                        </div>
                        {/* Type badge */}
                        <span style={{
                          fontSize: '9px', fontWeight: 600, letterSpacing: '0.5px',
                          padding: '2px 6px', borderRadius: '4px', flexShrink: 0,
                          background: item.media_type === 'tv' ? 'rgba(55,138,221,0.2)' : 'rgba(var(--accent), 0.2)',
                          color: item.media_type === 'tv' ? '#378ADD' : 'var(--accent)',
                        }}>{type}</span>
                      </Link>
                    )
                  })}
                  {/* See all */}
                  <button
                    onMouseDown={() => { router.push(`/search?q=${encodeURIComponent(query.trim())}`); setSuggestions([]); setSearchOpen(false); setQuery('') }}
                    style={{
                      width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                      borderTop: '0.5px solid rgba(255,255,255,0.07)', border: 'none',
                      color: 'var(--accent)', fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'center',
                    }}
                  >
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </div>
              )}
            </form>

            {/* Auth — desktop only */}
            <div className="hidden md:flex items-center gap-2">
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-neutral-800 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/5 transition-colors outline-none">
                      <UserAvatar firstName={user.firstName} lastName={user.lastName} image={user.image} size={28} />
                      <span className="text-sm text-neutral-300 hidden lg:block">{user.firstName}</span>
                      <ChevronDown size={14} className="text-neutral-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-neutral-900 border-neutral-800 text-neutral-200">
                    <div className="px-3 py-2.5 border-b border-neutral-800">
                      <p className="text-sm font-medium text-white">
                        {user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName}
                      </p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <DropdownMenuItem className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2" onClick={() => router.push('/profile')}>
                        <User size={14} className="text-neutral-400" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2" onClick={() => router.push('/favorites')}>
                        <Bookmark size={14} className="text-neutral-400" /> My Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2" onClick={() => router.push('/history')}>
                        <History size={14} className="text-neutral-400" /> Watch History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2" onClick={() => router.push('/settings')}>
                        <Settings size={14} className="text-neutral-400" /> Settings
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-neutral-800" />
                    <div className="py-1">
                      <DropdownMenuItem className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2 text-red-400 focus:text-red-400" onClick={handleSignOut}>
                        <LogOut size={14} /> Sign out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-neutral-300 hover:text-white hover:bg-white/5 gap-1.5">
                    <Link href="/login"><LogIn size={14} />Login</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-accent hover:bg-accent/80 text-white border-none">
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
          style={{ background: 'rgba(0,0,0,0.97)', borderTop: menuOpen ? '0.5px solid rgba(255,255,255,0.07)' : 'none' }}
        >
          <div style={{ padding: '1rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>

            {/* Nav links */}
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-3 rounded-md text-sm transition-colors',
                    active ? 'text-white font-medium bg-white/5' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '8px 0' }} />

            {/* Auth section */}
            {isLoading ? (
              <div className="h-10 rounded-md bg-neutral-800 animate-pulse" />
            ) : user ? (
              <>
                {/* User info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '4px' }}>
                  <UserAvatar firstName={user.firstName} lastName={user.lastName} image={user.image} size={36} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#f0eff5' }}>
                      {user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName}
                    </p>
                    <p style={{ fontSize: '11px', color: '#8884a0' }}>{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" className="flex items-center gap-2.5 px-3 py-3 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  <User size={14} /> Profile
                </Link>
                <Link href="/history" className="flex items-center gap-2.5 px-3 py-3 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  <History size={14} /> Watch History
                </Link>
                <Link href="/settings" className="flex items-center gap-2.5 px-3 py-3 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  <Settings size={14} /> Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-md text-sm text-red-400 hover:bg-white/5 transition-colors text-left w-full"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                <Button asChild variant="ghost" size="sm" className="flex-1 text-neutral-300 hover:text-white hover:bg-white/5 gap-1.5">
                  <Link href="/login"><LogIn size={14} />Login</Link>
                </Button>
                <Button asChild size="sm" className="flex-1 bg-accent hover:bg-accent/80 text-white border-none">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
