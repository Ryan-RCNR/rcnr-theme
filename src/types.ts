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
