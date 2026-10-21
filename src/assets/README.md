# Image Asset Guide

This project uses a centralized image asset manifest in `src/assets/images.ts`.

## How it works

- `src/assets/images.ts` loads available files from `src/assets/images/` automatically.
- Optional presentation and branding series skip missing files.
- When you add your real images, keep the filenames listed below.

## Expected image filenames

### About section

- `about-portrait.webp`

### Projects section

- `project-1.webp` through `project-9.webp` (explicitly mapped in the manifest).

### Presentations section

- `presentation-1.webp` through `presentation-4.webp`
- `branding-1.webp` through `branding-3.webp`

The Presentations component is currently not mounted. Its typed image series
remain available so it can still compile without optional assets.

## Where to put images

Place image files in `src/assets/images/` using the names above.

## Notes

- Required portrait and project files must exist; they have no placeholder fallback.
- Copying optional presentation/branding files with these names updates their series automatically.
