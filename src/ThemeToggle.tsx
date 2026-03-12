import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type Theme = 'light' | 'dark'

const COOKIE_NAME = 'rcnr-theme'

/** Read theme from cookie (shared across all *.rcnr.net subdomains) */
function getCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  return match ? match[1] : null
}

/** Write theme cookie scoped to .rcnr.net (or current domain in dev) */
function setCookie(value: Theme) {
  const maxAge = 365 * 24 * 60 * 60 // 1 year
  const host = window.location.hostname
  // On *.rcnr.net, set domain=.rcnr.net so all subdomains share it.
  // On localhost / other dev domains, omit domain so it scopes to current host.
  const domainPart = host.endsWith('.rcnr.net') || host === 'rcnr.net'
    ? '; domain=.rcnr.net'
    : ''
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${domainPart}`
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  // Prefer cookie (cross-subdomain), fall back to localStorage (migration)
  const fromCookie = getCookie()
  if (fromCookie === 'light' || fromCookie === 'dark') return fromCookie
  const fromStorage = localStorage.getItem(COOKIE_NAME)
  if (fromStorage === 'light' || fromStorage === 'dark') {
    // Migrate localStorage to cookie, then remove localStorage entry
    setCookie(fromStorage)
    localStorage.removeItem(COOKIE_NAME)
    return fromStorage
  }
  // Default to system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setCookie(theme)
  }, [theme])

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--rcnr-text2, #6888aa)',
        transition: 'color 0.2s ease',
      }}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
