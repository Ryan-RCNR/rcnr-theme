import { useState, useEffect, useCallback } from 'react'

interface RequestToolModalProps {
  isOpen: boolean
  onClose: () => void
  toolName: string
  apiBaseUrl?: string
  userEmail?: string
}

export function RequestToolModal({
  isOpen,
  onClose,
  toolName,
  apiBaseUrl = 'https://api.rcnr.net',
  userEmail,
}: RequestToolModalProps) {
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleClose = useCallback(() => {
    setDescription('')
    setError('')
    setSubmitted(false)
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
      const res = await fetch(`${apiBaseUrl}/api/feedback/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_name: toolName, description, user_email: userEmail }),
      })
      if (res.ok) {
        setSubmitted(true)
        setTimeout(handleClose, 2000)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Could not send request. Check your connection.')
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
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-semibold" style={{ color: 'var(--rcnr-text)' }}>Request received. Thanks!</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold font-serif mb-1" style={{ color: 'var(--rcnr-text)' }}>Request a Tool</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--rcnr-text3)' }}>Have an idea for something we should build?</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--rcnr-text3)' }}>
                  Describe what you need
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What problem would this tool solve? What would it do?"
                  rows={5}
                  required
                  className="rcnr-input resize-none"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="btn-ice w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
