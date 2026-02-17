import type { RCNRSubNavProps } from './types'

function RCNRSubNav({ tabs }: RCNRSubNavProps) {
  return (
    <nav className="flex items-center gap-1 px-6 py-2 border-b border-brand/10 bg-surface/50">
      {tabs.map((tab) => {
        const isWarning = tab.variant === 'warning'
        const activeClass = isWarning
          ? 'bg-warning/10 text-warning border border-warning/20'
          : 'bg-brand/15 text-brand'
        const inactiveClass = isWarning
          ? 'text-warning/70 hover:text-warning hover:bg-warning/5 border border-warning/10'
          : 'text-brand/50 hover:text-brand hover:bg-brand/5'

        const className = `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
          tab.active ? activeClass : inactiveClass
        }`

        if (tab.href) {
          return (
            <a key={tab.label} href={tab.href} className={className}>
              {tab.icon}
              <span>{tab.label}</span>
            </a>
          )
        }

        return (
          <button
            key={tab.label}
            onClick={tab.onClick}
            className={className}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default RCNRSubNav
