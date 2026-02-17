import type { RCNRFooterProps } from './types'

function RCNRFooter({
  toolName,
  linkUrl = 'https://rcnr.net',
}: RCNRFooterProps) {
  return (
    <footer className="mt-auto py-4 text-center text-sm text-brand-dark/50">
      <a
        href={linkUrl}
        className="hover:text-brand transition-colors"
      >
        {toolName} — Part of the RCNR Teacher Toolbox
      </a>
    </footer>
  )
}

export default RCNRFooter
