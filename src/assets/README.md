# Image Asset Guide

This project uses a centralized image asset manifest in `src/assets/images.ts`.

## How it works

- `src/assets/images.ts` loads available files from `src/assets/images/` automatically.
- If an image is missing, the app falls back to a lightweight placeholder SVG.
- When you add your real images, keep the filenames listed below.

## Expected image filenames

### About section

- `about-portrait.png`

### Projects section

- `project-1.png`
- `project-2.png`
- `project-3.png`
- `project-4.png`
- `project-5.png`
- `project-6.png`

### Presentations section

- `presentation-1.png`
- `presentation-2.png`
- `presentation-3.png`
- `presentation-4.png`
- `branding-1.png`
- `branding-2.png`
- `branding-3.png`

## Where to put images

Place image files in `src/assets/images/` using the names above.

## Notes

- The app will render placeholder art until actual files are added.
- You do not need to update components after copying real images, as the manifest resolves them automatically.
