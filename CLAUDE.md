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
| `__horizontalNav` | a section | `{ id, step(dir) => boolean }` — see below |
| `__projectsGoTo`, `__projectsSlide` | Projects | External carousel control |

**Adding a section:** render a `<section data-snap id="...">` with `h-screen w-full overflow-hidden` and place it in `App.tsx`'s JSX in the intended scroll order. Snap indices are derived from DOM order of `[data-snap]`, so nothing else needs updating; `Navbar`'s `goTo(id)` resolves the index the same way.

**Horizontal takeover:** a section that wants to consume vertical intent registers `window.__horizontalNav = { id, step(dir) }`. `step` returns `true` if it handled the movement and `false` when it hits its edge, at which point App resumes normal vertical snapping. `Projects` uses this for its horizontal carousel.

### Boot sequence and code splitting

Only the hero ships in the entry chunk. `About`, `Services`, `Projects` and `Footer` are `React.lazy`, and `HexRadar` (which drags in all of recharts, ~100 kB gzip) is lazy inside `Services`. Three rules keep this working:

1. **The import thunks are shared.** `App.tsx` declares `importAbout()` etc. once; `lazy()` consumes them *and* the boot effect awaits the same promises. Module promises are cached, so the sections resolve while the preloader is still on screen and their Suspense fallbacks never actually paint.
2. **A fallback must render a `[data-snap]` section of the right height.** Snap indices come from the DOM order of `[data-snap]`; a fallback that renders nothing would renumber every section below it mid-load. That is what `SnapFallback` is for.
3. **Intro animations are gated on `revealed`, not on mount.** `Preloader` calls `onReveal` as the curtain *starts* lifting, and `Hero`/`Navbar` take a `start` prop so their intros play with the reveal instead of behind it. Anything new that animates on mount above the fold needs the same treatment, or it will play unseen.

`Preloader` owns its own exit and unmounts itself (`gone` state) — the parent keeps it rendered. Its counter is driven by a GSAP tween writing to the DOM directly; when adding to it, remember the crawl tween must be killed before the finish tween or the two fight over the same value.

### Responsive model

**The desktop composition (≥768px) is frozen.** Every phone change lives behind `max-width: 767px` (or `pointer: coarse` / `max-height: 560px`); when touching layout, verify desktop geometry is unchanged rather than assuming it.

The grid is driven by four tokens declared in `fonts.css` and overridden in `styles/responsive.css`, which `index.css` imports **last** so it beats Tailwind's utilities:

| Token | Desktop | Phone |
|---|---|---|
| `--grid-template` | `repeat(13, 1fr)` | `repeat(4, 1fr) 40px` |
| `--gutter` | `calc(100vw / 13)` | `20px` |
| `--content-pad-right` | `calc(100vw / 13 * 3)` | `60px` |
| `--accent-col` / `--last-col` | `12 / 13`, `13 / 14` | `5 / 6` |

So the phone layout is four fluid columns plus a 40px accent rail welded to the right edge; content always stops short of the rail (`--content-pad-right` clears it). `SectionRail` lives in that rail as the phone navigation — one marker per section, `mix-blend-mode: difference` so it reads over both the black and bone rail, doubling as a progress indicator. The desktop header's three word-buttons are pinned to grid columns 10–12, which do not exist on the phone grid, so `Navbar` drops them below the breakpoint.

Breakpoint state comes from `useMediaQuery.ts` (`useIsMobile` / `useIsTouch` / `useIsShort` / `useGridSpec`), read synchronously on first render so a phone never paints a desktop frame first. **`Grid`'s column count must track `--grid-template`** — it renders one child per column, and surplus children would wrap onto implicit rows.

Sections that restructure below 768px rather than just reflowing: `About` (portrait becomes a top band, copy stacks beneath — at 390px it used to render straight on top of the text), `Projects` (`ProjectPanel` stacks shot-over-copy; the desktop split's fixed 300px info column left the image exactly 0px wide), `Services` (the two radars become one switchable chart, since side-by-side gives each ~140px of drawing area), and `Footer` (mark over full-width contact buttons).

Two traps worth knowing:

- **`DotTitle` sets `white-space: nowrap` per line** so the title cannot reflow mid-typing. A line too long for the column is therefore *clipped*, not wrapped — give mobile its own line breaks (`LINES_MOBILE` in `Hero`) instead of trying to wrap it.
- **`useIsShort` (`max-height: 560px`)** exists for phone-landscape and short desktop windows, where the full-height `Footer` pushed its contact buttons off the bottom. Normal laptop heights are far above it.

### Layout system

Everything is built on a fixed **13-column full-viewport grid** defined in `src/styles/fonts.css` (despite the filename, that file holds the global layout/animation utilities):

- `.site-grid` — `grid-template-columns: repeat(13, 1fr)`
- `.col-accent` — column 12, the solid black/white accent stripe
- `.col-last` — column 13
- Padding is expressed as `calc(100vw / 13 * n)`; `.site-content` and `.site-gutter-x` are the common presets.

`<Grid />` renders the background column lines, the accent column fill, and the animated vertical "pulse" lines (whose infinite tweens are parked by an IntersectionObserver while that grid is off-screen — six sections' worth of pulses otherwise run at once). Every section stacks `<Grid />` at z-0 and its content at z-5+. Inside `Projects`, the column unit is recomputed as a `--col` CSS var from `clientWidth / 13` because `100vw` includes the scrollbar and would desync from the sections above.

### Animation conventions

GSAP + ScrollTrigger, registered per-file with `gsap.registerPlugin(ScrollTrigger)`. Sections gate their intro with a one-shot trigger that flips a `started`/`introReady` state, and pass that down as the `start` prop:

```tsx
ScrollTrigger.create({ trigger: sec.current, start: "top 60%", once: true,
  onEnter: () => setStarted(true) });
```

Reusable animation primitives in `src/app/components/`: `DotTitle` (line-by-line typewriter whose trailing period is a blinking caret — pass lines *without* the period), `Typewriter`, `MaskText` (per-line mask reveal), `MaskParagraph` (measures real wrapped lines first, then re-renders one mask per visual line), `ActionButton` (corner-animated button, `tone` light/dark), `HexRadar` (recharts 6-axis radar), `Cursor` (custom difference-blend cursor; `cursor: none` is global). `useFontsReady` gates text measurement until webfonts settle — use it before anything that types or measures text.

### Styles

`src/styles/index.css` imports, in order: `fonts.css` (fonts, `.site-grid` utilities, keyframes, Lenis CSS), `tailwind.css` (Tailwind v4 CSS-first config — `@import 'tailwindcss' source(none)` plus an explicit `@source`; there is no `tailwind.config.js`), and `theme.css` (shadcn design tokens carried over from the Figma export; largely unused by the current design, which hardcodes `#121316` ink / `#fafafa` surface). Root `default_shadcn_theme.css` is a reference dump, not imported.

### Assets

`src/assets/images.ts` resolves images via `import.meta.glob('./images/*', { eager: true })` and exports a typed `Images` manifest — drop files into `src/assets/images/` and reference them through `Images`, never by raw path. Project shots are requested per panel (`load={i <= slide}` in `Projects`) rather than left to `loading="lazy"`: a horizontally parked panel still sits within Chrome's ~3000 px lazy-load distance, so the attribute alone fetched all nine up front. The neighbour-prefetch effect keeps the next panel's shot warm so nothing pops in. Current files are `.webp` (`src/assets/README.md` still documents `.png` names and is out of date). `src/assets/svgPaths.ts` holds extracted Figma path data. `vite.config.ts` includes a `figma-asset-resolver` plugin mapping legacy `figma:asset/<file>` imports to `src/assets/<file>`.
