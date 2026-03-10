# @rcnr/theme - Claude Code Context

## Project Overview
Shared RCNR design system (v4.0.x) published as @rcnr/theme on npm. Provides CSS tokens, utility classes, and React components used by all 19+ RCNR frontend repos. Supports dark mode (default) and light mode via `data-theme="light"`.

## Tech Stack
- TypeScript + tsup (ESM, CJS, DTS output)
- React >=18 (peer dependency)

## Package Structure
- `index.css` — All CSS: @theme tokens, :root vars, [data-theme="light"] overrides, utility classes, animations
- `src/RCNRHeader.tsx` — Shared header (logo + tool name + nav actions)
- `src/RCNRSubNav.tsx` — Tab navigation
- `src/RCNRFooter.tsx` — Footer
- `src/RCNRMountainLogo.tsx` — SVG mountain logo (uses currentColor + --rcnr-logo-fill)
- `src/ReportIssueModal.tsx` / `src/RequestToolModal.tsx` — Shared modals
- `src/ThemeToggle.tsx` — Dark/light mode toggle button

## How Consumers Use It
```css
@import "tailwindcss";
@import "@rcnr/theme";
```
```tsx
import { RCNRHeader, RCNRFooter, ThemeToggle } from '@rcnr/theme'
```

## CRITICAL: Color Rules for All RCNR Projects

**NEVER hardcode hex colors.** Always use theme tokens. This is what makes light/dark mode work.

### Text Colors
| Need | Use this | NEVER this |
|------|----------|------------|
| Primary text (headings, body) | `text-fg` or `style={{ color: 'var(--rcnr-text)' }}` | `text-white`, `#FFFFFF` |
| Secondary text (descriptions) | `text-fg-muted` or `var(--rcnr-text2)` | `text-[#9AA0A6]`, `text-gray-400` |
| Tertiary text (captions, hints) | `text-fg-dim` or `var(--rcnr-text3)` | `text-[#5F6368]`, `text-gray-500` |
| Brand accent text | `text-brand` | `text-[#99D9D9]`, `#7ec8c8` |

### Background Colors
| Need | Use this | NEVER this |
|------|----------|------------|
| Page background | `bg-midnight` or `var(--rcnr-bg)` | `bg-[#000C17]`, `#161a20` |
| Card/panel surface | `var(--rcnr-surface)` or `glass-card` class | `bg-[#0A1E2E]`, `#1c2028` |
| Elevated surface | `var(--rcnr-surface2)` | `bg-white/5`, `bg-gray-700` |
| Nav/header | `glass-card` class | `bg-[#001628]` |

### Borders
| Need | Use this | NEVER this |
|------|----------|------------|
| Standard border | `var(--rcnr-border)` or `border-brand/15` | `rgba(153,217,217,0.1)` |
| Accent border | `var(--rcnr-accent)` | `#99D9D9`, `#7ec8c8` |

### Buttons
| Need | Use this | NEVER this |
|------|----------|------------|
| Primary CTA | `btn-amber` class | `bg-[#F5A623]`, inline amber styles |
| Secondary action | `btn-ice` class | Custom teal gradient |
| Tertiary/ghost | `btn-ghost` class | Custom border button |

### Inputs
| Need | Use this | NEVER this |
|------|----------|------------|
| Text input/textarea | `rcnr-input` class | `bg-surface-light border border-brand/15 text-white placeholder-brand/30` |

### Cards
| Need | Use this | NEVER this |
|------|----------|------------|
| Interactive card (hover lift) | `rcnr-card` class | Inline bg + border + shadow styles |
| Static card | `rcnr-card-flat` class | `glass-card` with custom overrides |

### Other Tokens
| Token | Purpose |
|-------|---------|
| `var(--rcnr-accent)` | Brand teal for decorative/identity use |
| `var(--rcnr-accent-dim)` | Teal at ~10% opacity for backgrounds |
| `var(--rcnr-cta)` | Gold for action buttons/highlights |
| `var(--rcnr-danger)` | Red for errors/warnings |
| `var(--rcnr-overlay)` | Modal backdrop |
| `var(--rcnr-logo-fill)` | Logo + tool name color (teal dark, charcoal light) |

### Exception: text-white IS okay when...
- On a colored button background (`bg-blue-600 text-white`) — the button itself has a fixed color
- Inside a widget/display that intentionally ignores theme (e.g., ClassZen projected widgets)
- On status badges with colored backgrounds (`bg-red-600 text-white`)

## Publishing Workflow
1. Edit source files (index.css or src/*.tsx)
2. `npm run build` — builds with tsup
3. `npm version patch` (or minor/major)
4. `npm publish`
5. Push empty commits to consuming repos to trigger Vercel redeploys

## Commands
- `npm run build` — Build with tsup (outputs to dist/)
- `npm version patch && npm publish` — Bump and publish

## Repository
- npm: @rcnr/theme
- GitHub: github.com/Ryan-RCNR/rcnr-theme
