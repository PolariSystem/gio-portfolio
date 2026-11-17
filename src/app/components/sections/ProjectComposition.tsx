import type { Project } from "./projectData";

/** Original project imagery, arranged in CSS without flattening the interfaces. */
export function ProjectComposition({ project, load, priority }: { project: Project; load: boolean; priority: boolean }) {
  const artwork = project.artwork;
  const pieces = artwork
    ? [
        { slot: "main", image: artwork.main },
        ...(artwork.detail ? [{ slot: "detail", image: artwork.detail }] : []),
        ...(artwork.mobile ? [{ slot: "mobile", image: artwork.mobile }] : []),
      ]
    : [{ slot: "main", image: { src: project.img, alt: `${project.title} — interface preview` } }];

  return (
    <figure className={`work-composition work-composition--${artwork?.layout ?? "single"} ${artwork?.detail ? "has-detail" : ""} ${artwork?.mobile ? "has-mobile" : ""}`}>
      {pieces.map(({ slot, image }) => (
        <div key={slot} className={`work-artwork work-artwork--${slot}`} data-work-layer>
          <img src={load ? image.src : undefined} alt={image.alt} draggable={false} loading={priority ? "eager" : "lazy"} decoding="async" />
        </div>
      ))}
    </figure>
  );
}
