/// <reference types="vite/client" />

/*const placeholder = new URL("./placeholder.svg", import.meta.url).href; */

const loadedImages = import.meta.glob("./images/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const resolveImage = (fileName: string) => loadedImages[`./images/${fileName}`];

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
};
