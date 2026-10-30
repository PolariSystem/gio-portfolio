# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page animated portfolio site (Giovany Cruz). Originally exported from Figma Make, now hand-maintained. React 18 + TypeScript + Vite 6 + Tailwind v4 + GSAP/ScrollTrigger + Lenis. No router, no backend, no tests, no linter.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`; `pnpm-workspace.yaml` disables native postinstall builds for `@tailwindcss/oxide` and `esbuild`).

```bash
pnpm install
pnpm dev        # vite dev server
pnpm build      # tsc -b && vite build  -> emits into docs/
pnpm preview    # serve the built docs/
pnpm exec tsc -b  # typecheck only
```

TS is strict with `noUnusedLocals` / `noUnusedParameters`. Note that `src/app/components/sections/Presentations.tsx` is an orphan — it is not mounted in `App.tsx`, but it is still typechecked, so its `Images.*Presentations` entries have to keep existing in the manifest.

## Deployment

GitHub Pages serves the **`docs/` folder of `main`**. Hence `base: '/gio-portfolio/'` in `vite.config.ts` and `build.outDir: 'docs'` with `emptyOutDir`. Deploying = run `pnpm build` and commit the regenerated `docs/`. The root `dist/` directory is a stale leftover from the previous setup and is not used.

## Architecture

### Scroll engine (`src/app/App.tsx`)

`App.tsx` owns all scrolling — this is the single most important file. Native wheel/touch scrolling is **cancelled** (`preventDefault`), and Lenis is instantiated with its event targets pointed at a detached `<div>` so it never free-scrolls; it is used purely as the easing engine for programmatic `scrollTo`. Navigation is one full-viewport section per gesture, with a ~1s cooldown and wheel-delta accumulation (`THRESHOLD = 40`) so one trackpad flick equals exactly one section.

Cross-component coordination happens through `window` globals set up and torn down by that effect:

| Global | Owner | Purpose |
|---|---|---|
| `__snapTo(idx)` | App | Scroll to the Nth `[data-snap]` section |
| `__currentSnapIdx` | App | Index of the active section |
| `__lenis` | App | Lenis instance |
| `__horizontalNav` | a section | `{ id, step(dir), scroll?(pixels) }` — see below |
| `__projectsGoTo`, `__projectsSlide` | Projects | External carousel control |

**Adding a section:** render a `<section data-snap id="...">` with `h-screen w-full overflow-hidden` and place it in `App.tsx`'s JSX in the intended scroll order. Snap indices are derived from DOM order of `[data-snap]`, so nothing else needs updating; `Navbar`'s `goTo(id)` resolves the index the same way.

**Carousel entry:** `App` dispatches `sectionnavigate` before switching sections. `Projects` resets immediately to the first panel when entered from above, or the last panel when entered from below. Shared navigation buttons resolve destinations by section ID.

**Section navigation takeover:** the legacy `__horizontalNav` hook accepts `{ id, axis, step(dir), scroll?(pixels) }`. Projects now uses a single native vertical `.work-scroll` scrollport; App lets wheel/touch/keyboard scroll it before moving to another page section. The optional `scroll` callback forwards input over fixed overlay controls into the same scrollport and returns false at a settled edge. Dots navigate to measured article anchors, with instant movement for reduced-motion preferences. Backgrounds use scroll-linked vertical parallax and crossfade as the next project content enters the viewport. Long mobile projects grow naturally; there are no nested scrolling cards or horizontal tracks.

### Boot sequence and code splitting

Only the hero ships in the entry chunk. `About`, `Services`, `Projects` and `Footer` are `React.lazy`, and `HexRadar` (which drags in all of recharts, ~100 kB gzip) is lazy inside `Services`. Three rules keep this working:

1. **The import thunks are shared.** `App.tsx` declares `importAbout()` etc. once; `lazy()` consumes them *and* the boot effect awaits the same promises. Module promises are cached, so the sections resolve while the preloader is still on screen and their Suspense fallbacks never actually paint.
2. **A fallback must render a `[data-snap]` section of the right height.** Snap indices come from the DOM order of `[data-snap]`; a fallback that renders nothing would renumber every section below it mid-load. That is what `SnapFallback` is for.
3. **Intro animations are gated on `revealed`, not on mount.** `Preloader` calls `onReveal` as the curtain *starts* lifting, and `Hero`/`Navbar` take a `start` prop so their intros play with the reveal instead of behind it. Anything new that animates on mount above the fold needs the same treatment, or it will play unseen.

`Preloader` owns its own exit and unmounts itself (`gone` state) — the parent keeps it rendered. Its counter is driven by a GSAP tween writing to the DOM directly; when adding to it, remember the crawl tween must be killed before the finish tween or the two fight over the same value.

### Responsive model

**Use the shared responsive grid.** `SiteGridProvider` measures available width and `Navbar` measures its largest button plus 16px of clearance. Desktop uses up to 13 equal columns, reducing the count before buttons outgrow their cells. `useGridSpec()` supplies the matching count to every background and the project carousel. Phone overrides remain behind `max-width: 767px`.

The grid is driven by four tokens declared in `fonts.css` and overridden in `styles/responsive.css`, which `index.css` imports **last** so it beats Tailwind's utilities:

| Token | Desktop | Phone |
|---|---|---|
| `--grid-template` | Shared count of 6–13 equal columns | `repeat(4, 1fr) 40px` |
| `--gutter` | `var(--grid-unit)` | `20px` |
| `--content-pad-right` | `calc(var(--grid-unit) * 3)` | `60px` |
| `--accent-col` / `--last-col` | Last two shared columns | `5 / 6` |

So the phone layout is four fluid columns plus a 40px accent rail welded to the right edge; content always stops short of the rail (`--content-pad-right` clears it). `SectionRail` lives in that rail as the phone navigation — one marker per section, `mix-blend-mode: difference` so it reads over both the black and bone rail, doubling as a progress indicator. The desktop header uses the three columns before the final gutter; `Navbar` drops these buttons below the phone breakpoint.

Breakpoint state comes from `useMediaQuery.ts` (`useIsMobile` / `useIsTouch` / `useIsShort` / `useGridSpec`), read synchronously on first render so a phone never paints a desktop frame first. **`Grid`'s column count must track `--grid-template`** — it renders one child per column, and surplus children would wrap onto implicit rows.

Sections that restructure on small screens: `About` (portrait becomes a top band), `Projects` (metadata stacks above case content in one continuous vertical flow, with project pagination on the right), `Services` (the two radars become one switchable chart), and `Footer` (contact and mark stack vertically). Project content lives in `sections/projectData.ts`. SectionRail yields its mobile rail to the project index while Work is active.

Two traps worth knowing:

- **`DotTitle` sets `white-space: nowrap` per line** so the title cannot reflow mid-typing. A line too long for the column is therefore *clipped*, not wrapped — give mobile its own line breaks (`LINES_MOBILE` in `Hero`) instead of trying to wrap it.
- **`useIsShort` (`max-height: 560px`)** exists for phone-landscape and short desktop windows, where the full-height `Footer` pushed its contact buttons off the bottom. Normal laptop heights are far above it.

### Layout system

Everything shares the **responsive full-viewport grid** whose tokens live in `src/styles/fonts.css` and whose measurements come from `SiteGridProvider`:

- `.site-grid` — the shared `--grid-template`
- `.col-accent` — the penultimate column, the solid black/white accent stripe
- `.col-last` — the last column
- Padding uses `var(--grid-unit)` and `var(--gutter)`; avoid hardcoded divisions by 13. `.site-content` and `.site-gutter-x` are the common presets.

`<Grid />` renders the background column lines, accent fill, and animated vertical pulses, pausing offscreen animation. Projects deliberately does not mount a Grid: it uses full-screen imagery under a single dark overlay, including behind the fixed header and pagination. Text alignment still uses the shared `--gutter`. ResizeObserver measures article anchors and preserves reading position when dimensions change.

### Animation conventions

GSAP + ScrollTrigger, registered per-file with `gsap.registerPlugin(ScrollTrigger)`. Sections gate their intro with a one-shot trigger that flips a `started`/`introReady` state, and pass that down as the `start` prop:

```tsx
ScrollTrigger.create({ trigger: sec.current, start: "top 60%", once: true,
  onEnter: () => setStarted(true) });
```

Reusable animation primitives in `src/app/components/`: `DotTitle` (line-by-line typewriter whose trailing period is a blinking caret — pass lines *without* the period), `Typewriter`, `MaskText` (per-line mask reveal), `MaskParagraph` (measures real wrapped lines first, then re-renders one mask per visual line), `ActionButton` (corner-animated button, `tone` light/dark), `HexRadar` (recharts 6-axis radar), `Cursor` (custom difference-blend cursor; `cursor: none` is global). `useFontsReady` gates text measurement until webfonts settle — use it before anything that types or measures text.

### Styles

Typography is centralized in `src/styles/fonts.css`: display/heading/subheading/lead/body/detail/label/button/contact tokens. Body copy is 16–18px, detail text 14–16px, labels 12–13px, and all text actions 16px with a 48px minimum target. Use these tokens instead of section-specific small font sizes. Mobile project imagery sits below a stronger full-screen overlay; only the top text edge fades, and the About shortcut occupies the right rail so the lower text remains fully legible. Chart labels use the same reading scale and clamp to measured SVG bounds.

`src/styles/index.css` imports, in order: `fonts.css` (fonts, `.site-grid` utilities, keyframes, Lenis CSS), `tailwind.css` (Tailwind v4 CSS-first config — `@import 'tailwindcss' source(none)` plus an explicit `@source`; there is no `tailwind.config.js`), and `theme.css` (shadcn design tokens carried over from the Figma export; largely unused by the current design, which hardcodes `#121316` ink / `#fafafa` surface). Root `default_shadcn_theme.css` is a reference dump, not imported.

### Assets

`src/assets/images.ts` resolves images via `import.meta.glob('./images/*', { eager: true })` and exports a typed `Images` manifest — drop files into `src/assets/images/` and reference them through `Images`, never by raw path. Project shots are requested per panel (`load={i <= slide}` in `Projects`) rather than left to `loading="lazy"`: a horizontally parked panel still sits within Chrome's ~3000 px lazy-load distance, so the attribute alone fetched all nine up front. The neighbour-prefetch effect keeps the next panel's shot warm so nothing pops in. Current files are `.webp` (`src/assets/README.md` still documents `.png` names and is out of date). `src/assets/svgPaths.ts` holds extracted Figma path data. `vite.config.ts` includes a `figma-asset-resolver` plugin mapping legacy `figma:asset/<file>` imports to `src/assets/<file>`.
