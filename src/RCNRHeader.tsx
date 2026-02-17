import type { ReactNode } from 'react'
import type { RCNRHeaderProps } from './types'
import RCNRMountainLogo from './RCNRMountainLogo'

function NavButton({
  onClick,
  icon,
  label,
  title,
}: {
  onClick: () => void
  icon: ReactNode
  label: string
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-brand/70 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
      title={title ?? label}
    >
      {icon}
      <span className="hidden md:inline text-sm">{label}</span>
    </button>
  )
}

const defaultReportIssue = () =>
  window.open('mailto:support@rcnr.net?subject=Bug%20Report', '_blank')

const defaultRequestTool = () =>
  window.open('mailto:support@rcnr.net?subject=Feature%20Request', '_blank')

function RCNRHeader({
  toolName,
  dashboardUrl = 'https://teacher.rcnr.net',
  extraNavItems,
  userAvatar,
  onHowItWorks,
  onReportIssue = defaultReportIssue,
  onRequestTool = defaultRequestTool,
}: RCNRHeaderProps) {
  return (
    <header className="glass-card border-b border-brand/15 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Tool Name */}
        <div className="flex items-center gap-4">
          <RCNRMountainLogo href={dashboardUrl} />
          <span className="text-xl font-serif text-brand">{toolName}</span>
        </div>

        {/* Right: Nav Actions */}
        <div className="flex items-center gap-2">
          {/* Tool-specific nav items first */}
          {extraNavItems?.map((item) => (
            <NavButton
              key={item.label}
              onClick={item.onClick}
              icon={item.icon}
              label={item.label}
            />
          ))}

          {/* Standard nav items in fixed order */}
          {onHowItWorks && (
            <NavButton
              onClick={onHowItWorks}
              label="How It Works"
              icon={
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
                  />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              }
            />
          )}

          <NavButton
            onClick={onReportIssue}
            label="Report Issue"
            icon={
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />

          <NavButton
            onClick={onRequestTool}
            label="Request Tool"
            icon={
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
          />

          {userAvatar}
        </div>
      </div>
    </header>
  )
}

export default RCNRHeader
