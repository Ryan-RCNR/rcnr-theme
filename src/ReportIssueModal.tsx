import { useState, useEffect, useCallback } from 'react'
import { ContactEmailField, NoStudentDataNote, sendFeedback, useHasSession, type GetFeedbackToken } from './feedback'

interface ReportIssueModalProps {
  isOpen: boolean
  onClose: () => void
  toolName: string
  apiBaseUrl?: string
  userEmail?: string
  /** Clerk's getToken from useAuth(). Lets the report say who sent it. */
  getToken?: GetFeedbackToken
  /** Shown to support with the report, e.g. a git SHA or package version. */
  appVersion?: string
}

export function ReportIssueModal({
  isOpen,
  onClose,
  toolName,
  apiBaseUrl = 'https://api.rcnr.net',
  userEmail,
  getToken,
  appVersion,
}: ReportIssueModalProps) {
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [followup, setFollowup] = useState(false)
  const [category, setCategory] = useState<'bug' | 'idea'>('bug')
  const hasSession = useHasSession(isOpen, getToken, userEmail)

  const handleClose = useCallback(() => {
    setDescription('')
    setError('')
    setSubmitted(false)
    setContactEmail('')
    setFollowup(false)
    setCategory('bug')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const result = await sendFeedback(
        apiBaseUrl,
        'report',
        {
          tool_name: toolName,
          description,
          category,
          user_email: userEmail || contactEmail.trim() || undefined,
          app_version: appVersion,
        },
        getToken,
      )
      if (result.ok) {
        setFollowup(result.followup)
        setSubmitted(true)
        setTimeout(handleClose, result.followup ? 3500 : 2000)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Could not send report. Check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--rcnr-overlay)', backdropFilter: 'blur(6px)' }}
      onClick={handleClose}
    >
      <div
        className="relative glass-card rounded-2xl w-full max-w-md p-8"
        style={{ animation: 'fadeIn 0.15s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
          style={{ color: 'var(--rcnr-text3)' }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--rcnr-text)'; e.currentTarget.style.background = 'var(--rcnr-surface2)' }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--rcnr-text3)'; e.currentTarget.style.background = 'transparent' }}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: 'var(--rcnr-text)' }}>Report sent. Thanks!</p>
            {followup && (
              <p className="text-sm mt-2" style={{ color: 'var(--rcnr-text3)' }}>
                I'll email you if I have questions, and again when it's fixed.
              </p>
            )}
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold font-serif mb-1" style={{ color: 'var(--rcnr-text)' }}>Report an Issue</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--rcnr-text3)' }}>Found a bug, or have an idea? Let us know.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--rcnr-text3)' }}>Tool</label>
                <input
                  type="text"
                  value={toolName}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ background: 'var(--rcnr-surface2)', border: '1px solid var(--rcnr-border)', color: 'var(--rcnr-text3)' }}
                />
              </div>

              <div className="flex gap-2" role="radiogroup" aria-label="Type">
                {(['bug', 'idea'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={category === c}
                    onClick={() => setCategory(c)}
                    className={`${category === c ? 'btn-ice' : 'btn-ghost'} flex-1 py-2 text-sm rounded-xl`}
                  >
                    {c === 'bug' ? 'Something broke' : 'Idea'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--rcnr-text3)' }}>
                  {category === 'bug' ? 'What went wrong?' : "What's your idea?"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={category === 'bug' ? 'What were you doing, and what happened?' : 'What would make this tool better?'}
                  rows={4}
                  maxLength={5000}
                  required
                  className="rcnr-input resize-none"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              {!hasSession && <ContactEmailField value={contactEmail} onChange={setContactEmail} />}

              <NoStudentDataNote />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="btn-ice w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Submit Report'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
