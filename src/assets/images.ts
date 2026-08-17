/// <reference types="vite/client" />

/*const placeholder = new URL("./placeholder.svg", import.meta.url).href; */

const loadedImages = import.meta.glob("./images/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const resolveImage = (fileName: string) => loadedImages[`./images/${fileName}`];

/** Numbered series (`name-1.webp`, `name-2.webp`, …), skipping absent files. */
const resolveSeries = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => resolveImage(`${prefix}-${i + 1}.webp`)).filter(Boolean);

export const Images = {
  aboutPortrait: resolveImage("about-portrait.webp"),
  projectImages: [
    resolveImage("project-1.webp"),
    resolveImage("project-2.webp"),
    resolveImage("project-3.webp"),
    resolveImage("project-4.webp"),
    resolveImage("project-5.webp"),
    resolveImage("project-6.webp"),
    resolveImage("project-7.webp"),
    resolveImage("project-8.webp"),
    resolveImage("project-9.webp"),
  ],
  // Consumed by the (currently unmounted) Presentations section.
  digitalPresentations: resolveSeries("presentation", 4),
  brandingPresentations: resolveSeries("branding", 3),
};
