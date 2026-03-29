'use client'

import { useEffect, useState } from 'react'
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
  Search,
  Settings,
  LogIn,
  LogOut,
  User,
  Bookmark,
  ChevronDown,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import UserAvatar from '@/components/UserAvatar'

const NAV_LINKS = [
  { label: 'Home',         href: '/'          },
  { label: 'Movies',       href: '/movies'    },
  { label: 'TV Shows',     href: '/tv'        },
  { label: 'Anime',        href: '/anime'     },
  { label: 'My Favorites', href: '/favorites' },
]

export default function Navbar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { data: session, status } = useSession()

  const [scrolled,    setScrolled]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [query,       setQuery]       = useState('')

  const user      = session?.user
  const isLoading = status === 'loading'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setSearchOpen(false)
    }
  }

  function handleSignOut() {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-black/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      )}
      style={{
        background: scrolled
          ? undefined
          : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
      }}
    >
      <div
        className="flex items-center justify-between gap-6"
        style={{ maxWidth: '1390px', margin: '0 auto', padding: '0 2rem', height: '64px' }}
      >

        {/* ── Left: Logo + Nav links ── */}
        <div className="flex items-center gap-8">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/assets/logo_landscape.png"
              alt="StreamVault"
              height={32}
              width={160}
              priority
            />
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm transition-colors duration-150',
                    active
                      ? 'text-white font-medium'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* ── Right: Search + Auth ── */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-2 overflow-hidden transition-all duration-300 rounded-md',
                searchOpen
                  ? 'w-52 bg-neutral-900 border border-neutral-700 px-3'
                  : 'w-8'
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
                  onChange={e => setQuery(e.target.value)}
                  onBlur={() => { if (!query) setTimeout(() => setSearchOpen(false), 150) }}
                  placeholder="Search titles..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-500 w-full"
                />
              )}
            </div>
          </form>

          {/* Auth — skeleton while loading */}
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-neutral-800 animate-pulse" />
          ) : user ? (

            // ── Signed in ──
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/5 transition-colors outline-none">
                  <UserAvatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    image={user.image}
                    size={28}
                  />
                  <span className="text-sm text-neutral-300 hidden sm:block">
                    {user.firstName}
                  </span>
                  <ChevronDown size={14} className="text-neutral-500" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 bg-neutral-900 border-neutral-800 text-neutral-200"
              >
                {/* User info header */}
                <div className="px-3 py-2.5 border-b border-neutral-800">
                  <p className="text-sm font-medium text-white">
                    {user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName}
                  </p>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                <div className="py-1">
                  <DropdownMenuItem
                    className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2"
                    onClick={() => router.push('/profile')}
                  >
                    <User size={14} className="text-neutral-400" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2"
                    onClick={() => router.push('/favorites')}
                  >
                    <Bookmark size={14} className="text-neutral-400" />
                    My Favorites
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2"
                    onClick={() => router.push('/history')}
                  >
                    <History size={14} className="text-neutral-400" />
                    Watch History
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2"
                    onClick={() => router.push('/settings')}
                  >
                    <Settings size={14} className="text-neutral-400" />
                    Settings
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-neutral-800" />

                <div className="py-1">
                  <DropdownMenuItem
                    className="hover:bg-neutral-800 cursor-pointer gap-2.5 px-3 py-2 text-red-400 focus:text-red-400"
                    onClick={handleSignOut}
                  >
                    <LogOut size={14} />
                    Sign out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

          ) : (

            // ── Signed out ──
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-neutral-300 hover:text-white hover:bg-white/5 gap-1.5"
              >
                <Link href="/login">
                  <LogIn size={14} />
                  Login
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="bg-accent hover:bg-accent/80 text-white border-none"
              >
                <Link href="/register">Sign up</Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-white/5 px-2"
              >
                <Link href="/settings">
                  <Settings size={16} />
                </Link>
              </Button>
            </div>
          )}

        </div>
      </div>
    </header>
  )
}