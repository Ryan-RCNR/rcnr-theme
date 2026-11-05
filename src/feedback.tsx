import { useEffect, useState } from 'react'

/** Returns the signed-in teacher's Clerk session token, or null when signed out.
 *  Pass Clerk's `getToken` from `useAuth()` so reports say who sent them. */
export type GetFeedbackToken = () => Promise<string | null | undefined>

export interface FeedbackResult {
  ok: boolean
  /** True when the report has an address Ryan can reply to. */
  followup: boolean
}

/** Path only: never the query string or hash (they can hold join codes). */
export function currentPagePath(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return window.location.pathname.slice(0, 300) || undefined
}

async function tokenOrNull(getToken?: GetFeedbackToken): Promise<string | null> {
  if (!getToken) return null
  try {
    return (await getToken()) || null
  } catch {
    return null
  }
}

/** True once we know the person is signed in (so the email box can hide). */
export function useHasSession(isOpen: boolean, getToken?: GetFeedbackToken, userEmail?: string): boolean {
  const [hasSession, setHasSession] = useState<boolean>(!!userEmail)
  useEffect(() => {
    if (!isOpen) return
    if (userEmail) { setHasSession(true); return }
    let alive = true
    tokenOrNull(getToken).then((t) => { if (alive) setHasSession(!!t) })
    return () => { alive = false }
  }, [isOpen, getToken, userEmail])
  return hasSession
}

export async function sendFeedback(
  apiBaseUrl: string,
  route: 'report' | 'request',
  body: Record<string, unknown>,
  getToken?: GetFeedbackToken,
): Promise<FeedbackResult> {
  const token = await tokenOrNull(getToken)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${apiBaseUrl}/api/feedback/${route}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...body, page_path: currentPagePath() }),
  })
  if (!res.ok) return { ok: false, followup: false }
  let followup = false
  try {
    const data = await res.json()
    followup = !!data?.followup
  } catch {
    // Older API: plain {ok: true}. Still a success.
  }
  return { ok: true, followup }
}

export function ContactEmailField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--rcnr-text3)' }}>
        Your email (optional)
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="So I can follow up and tell you when it's fixed"
        maxLength={254}
        autoComplete="email"
        className="rcnr-input"
        style={{ paddingLeft: '1rem' }}
      />
    </div>
  )
}

export function NoStudentDataNote() {
  return (
    <p className="text-xs" style={{ color: 'var(--rcnr-text3)' }}>
      Please don't include student names or other student information.
    </p>
  )
}
