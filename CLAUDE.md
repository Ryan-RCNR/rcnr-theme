# @rcnr/theme - Claude Code Context

## Project Overview
Shared RCNR design system published as @rcnr/theme on npm. Provides CSS tokens (Tailwind 4 @theme), utility classes, and React components (RCNRHeader, RCNRSubNav, RCNRFooter, RCNRMountainLogo) used by all 19+ RCNR frontend repos.

## Tech Stack
- TypeScript
- tsup (bundler — ESM, CJS, DTS output)
- React >=18 (peer dependency)

## Package Structure
- `index.css` — CSS tokens (@theme block), :root vars, body grid, glass-card, btn-ice, btn-amber, btn-ghost, scrollbar, focus-visible, fadeIn
- `src/index.ts` — Barrel exports for all React components and types
- `src/RCNRHeader.tsx` — Shared header with nav actions (How It Works, Report Issue, Request Tool)
- `src/RCNRSubNav.tsx` — Tab navigation with active/inactive states, warning variant
- `src/RCNRFooter.tsx` — Footer with tool name and link to rcnr.net
- `src/RCNRMountainLogo.tsx` — SVG mountain logo with anchor wrapper
- `src/types.ts` — TypeScript interfaces (RCNRHeaderProps, RCNRSubNavProps, RCNRFooterProps)

## Design Tokens (index.css)
- Colors: brand (#99D9D9), brand-dark (#68A2B9), surface (#001628), surface-light (#0A1E2E), midnight (#000C17), amber (#F5A623)
- Fonts: font-serif (Instrument Serif), font-sans (Geist)
- Card bg is opaque (#0A1E2E) — grid shows in gaps, never through cards

## How Consumers Use It
```css
@import "tailwindcss";
@import "@rcnr/theme";
```
```tsx
import { RCNRHeader, RCNRFooter, RCNRSubNav } from '@rcnr/theme'
```

## Publishing Workflow
1. Edit source files (index.css or src/*.tsx)
2. `npm run build` — builds with tsup
3. `npm version patch` (or minor/major)
4. `npm publish`
5. `npm update @rcnr/theme` in each consuming repo

## Commands
- `npm run build` — Build with tsup (outputs to dist/)
- `npm version patch && npm publish` — Bump and publish

## Repository
- npm: @rcnr/theme
- GitHub: github.com/Ryan-RCNR/rcnr-theme
