import type { ReactNode } from 'react'

export interface RCNRHeaderProps {
  toolName: string
  dashboardUrl?: string
  extraNavItems?: {
    label: string
    icon?: ReactNode
    onClick: () => void
  }[]
  userAvatar?: ReactNode
  onHowItWorks?: () => void
  onReportIssue?: () => void
  onRequestTool?: () => void
}

export interface RCNRSubNavProps {
  tabs: {
    label: string
    href?: string
    onClick?: () => void
    active: boolean
    icon?: ReactNode
    variant?: 'default' | 'warning'
  }[]
}

export interface RCNRFooterProps {
  toolName: string
  linkUrl?: string
}

export type SubscriptionWallState = 'loading' | 'active' | 'inactive'

export interface SubscriptionWallProps {
  /** Map from GET /api/subscription/status: loading/active render children; inactive shows the wall. */
  state: SubscriptionWallState
  /** The gate's own teacher-readable copy (`detail` from the status endpoint). */
  detail?: string
  toolName: string
  /** Defaults to https://rcnr.net/subscribe */
  subscribeUrl?: string
  /** Consumer wires Clerk signOut; omitting hides the "wrong account?" link. */
  onSignOut?: () => void
  children: ReactNode
}
