import type { ReactNode } from 'react'
import type { SubscriptionWallProps } from './types'

/**
 * SubscriptionWall — an honest door, not a lock.
 *
 * Presentational only. The consumer fetches `GET /api/subscription/status`
 * (rcnr-ai-api) and maps it to `state`; this component just decides what to
 * show:
 *
 *   loading  → children (fail-open: never punish a paying teacher with a
 *              spinner wall on every cold load — the API gate still enforces)
 *   active   → children
 *   inactive → full-screen renew/subscribe panel with the gate's own `detail`
 *              copy, a CTA to rcnr.net/subscribe, and a "wrong account?"
 *              escape hatch (consumer supplies `onSignOut` from Clerk).
 *
 * Enforcement is the API's job (every tool route fails closed). This exists so
 * a non-subscriber learns they're paywalled BEFORE typing a topic and clicking
 * generate — the 2026-08-16 support-email trap.
 */
export function SubscriptionWall({
  state,
  detail,
  toolName,
  subscribeUrl = 'https://rcnr.net/subscribe',
  onSignOut,
  children,
}: SubscriptionWallProps): ReactNode {
  if (state !== 'inactive') return <>{children}</>

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rcnr-subscription-wall-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--rcnr-bg)' }}
    >
      <div className="glass-card rounded-2xl w-full max-w-md p-8 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'var(--rcnr-warn-bg)', border: '1px solid var(--rcnr-warn-border)' }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--rcnr-warn)' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2
          id="rcnr-subscription-wall-title"
          className="text-xl font-bold font-serif mb-2"
          style={{ color: 'var(--rcnr-text)' }}
        >
          Your Teacher Toolbox subscription isn't active
        </h2>

        <p className="text-sm mb-1" style={{ color: 'var(--rcnr-text2)' }}>
          {detail || 'No active subscription found. Please subscribe to continue.'}
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--rcnr-text3)' }}>
          {toolName} is part of Teacher Toolbox. One subscription unlocks every tool.
        </p>

        <a
          href={subscribeUrl}
          className="btn-amber w-full justify-center py-3 text-sm rounded-xl"
        >
          Subscribe or renew
        </a>

        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            className="mt-4 text-xs underline-offset-2 hover:underline"
            style={{ color: 'var(--rcnr-text3)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Signed in with the wrong account? Sign out
          </button>
        )}
      </div>
    </div>
  )
}

export default SubscriptionWall
