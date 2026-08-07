/// <reference types="vite/client" />

const placeholder = new URL("./placeholder.svg", import.meta.url).href;

const loadedImages = import.meta.glob("./images/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const resolveImage = (fileName: string) => loadedImages[`./${fileName}`] ?? placeholder;

export const Images = {
  aboutPortrait: resolveImage("about-portrait.png"),
  projectImages: [
    resolveImage("project-1.png"),
    resolveImage("project-2.png"),
    resolveImage("project-3.png"),
    resolveImage("project-4.png"),
    resolveImage("project-5.png"),
    resolveImage("project-6.png"),
  ],
  digitalPresentations: [
    resolveImage("presentation-1.png"),
    resolveImage("presentation-2.png"),
    resolveImage("presentation-3.png"),
    resolveImage("presentation-4.png"),
  ],
  brandingPresentations: [
    resolveImage("branding-1.png"),
    resolveImage("branding-2.png"),
    resolveImage("branding-3.png"),
  ],
};
