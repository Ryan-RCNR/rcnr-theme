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
  // RCNR is a dark-brand product line: default to dark for users who have not
  // made an explicit choice, REGARDLESS of OS prefers-color-scheme. (Changed in
  // v4.1.5 — previously OS-light users got light-by-default, which fought the
  // dark brand on display tools like ClassZen. Explicit toggles still win above.)
  return 'dark'
}

export default function ThemeToggle() {
  // SSR-safe: the server has no cookie/localStorage/matchMedia, so it always
  // renders 'dark'. The client MUST render the same thing on its first paint or
  // React throws a hydration mismatch (#418/#423) — the icon + aria-label would
  // otherwise differ. So we seed with the SSR default and read the real theme
  // only after mount, gating the visible label/icon behind `mounted`.
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Resolve the real theme once, on the client, after hydration.
  useEffect(() => {
    setMounted(true)
    setTheme(getInitialTheme())
  }, [])

  // Apply the resolved theme to the document (only after mount has set it).
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    setCookie(theme)
  }, [theme, mounted])

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  // Before mount, render the exact SSR output (dark → Sun icon, "Switch to light
  // mode"). React hydrates cleanly, then the effect above swaps in the real theme.
  const displayTheme: Theme = mounted ? theme : 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${displayTheme === 'dark' ? 'light' : 'dark'} mode`}
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
      {displayTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
