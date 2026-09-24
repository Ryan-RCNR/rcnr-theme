# @rcnr/theme - Claude Code Context

## Project Overview
Shared RCNR design system (v4.x) published as @rcnr/theme on npm. Provides CSS tokens, utility classes, and React components used by all 19+ RCNR frontend repos. Dark mode default; light mode via `data-theme="light"`. TypeScript + tsup (ESM, CJS, DTS output); React >=18 peer dependency.

## Package Structure
- `index.css` — All CSS: @theme tokens, :root vars, [data-theme="light"] overrides, utility classes, animations
- `src/RCNRHeader.tsx` (logo + tool name + nav actions) · `RCNRSubNav.tsx` (tab navigation) · `RCNRFooter.tsx` · `RCNRMountainLogo.tsx` (SVG mountain logo, uses currentColor + --rcnr-logo-fill) · `ReportIssueModal.tsx` / `RequestToolModal.tsx` (shared modals) · `ThemeToggle.tsx` (dark/light toggle)
- Consumers: `@import "tailwindcss"; @import "@rcnr/theme";` in CSS and `import { RCNRHeader, RCNRFooter, ThemeToggle } from '@rcnr/theme'`

## CRITICAL: Color Rules for All RCNR Projects
**NEVER hardcode hex colors.** Always use theme tokens — this is what makes light/dark mode work.
- **Text:** primary `text-fg` / `var(--rcnr-text)` (never `text-white`, `#FFFFFF`) · secondary `text-fg-muted` / `var(--rcnr-text2)` (never `text-gray-400`, `text-[#9AA0A6]`) · tertiary `text-fg-dim` / `var(--rcnr-text3)` (never `text-gray-500`, `text-[#5F6368]`) · brand accent `text-brand` (never `text-[#99D9D9]`, `#7ec8c8`)
- **Backgrounds:** page `bg-midnight` / `var(--rcnr-bg)` (never `bg-[#000C17]`, `#161a20`) · card/panel `var(--rcnr-surface)` or `glass-card` (never `bg-[#0A1E2E]`, `#1c2028`) · elevated `var(--rcnr-surface2)` (never `bg-white/5`, `bg-gray-700`) · nav/header `glass-card` (never `bg-[#001628]`)
- **Borders:** standard `var(--rcnr-border)` or `border-brand/15` (never `rgba(153,217,217,0.1)`) · accent `var(--rcnr-accent)` (never `#99D9D9`, `#7ec8c8`)
- **Buttons:** primary CTA `btn-amber` (never `bg-[#F5A623]`, inline amber) · secondary `btn-ice` (never custom teal gradient) · tertiary/ghost `btn-ghost` (never custom border button)
- **Inputs:** `rcnr-input` (never `bg-surface-light border border-brand/15 text-white placeholder-brand/30`)
- **Cards:** interactive (hover lift) `rcnr-card` (never inline bg + border + shadow) · static `rcnr-card-flat` (never `glass-card` with custom overrides)
- **Other tokens:** `--rcnr-accent` (brand teal, decorative/identity) · `--rcnr-accent-dim` (teal ~10% opacity for backgrounds) · `--rcnr-cta` (gold for action buttons/highlights) · `--rcnr-danger` (red for errors/warnings) · `--rcnr-overlay` (modal backdrop) · `--rcnr-logo-fill` (logo + tool name; teal dark, charcoal light)
- **`text-white` IS okay:** on a colored button background (`bg-blue-600 text-white`) · inside a widget/display that intentionally ignores theme (e.g. ClassZen projected widgets) · on status badges with colored backgrounds (`bg-red-600 text-white`)

## Publishing Workflow
1. Edit `index.css` or `src/*.tsx` → 2. `npm run build` (tsup → dist/) → 3. `npm version patch` (or minor/major) → 4. `npm publish` → 5. `npm update @rcnr/theme` in each consumer that needs it, then push to trigger its Vercel redeploy

## Repository
- npm: @rcnr/theme · GitHub: github.com/Ryan-RCNR/rcnr-theme
