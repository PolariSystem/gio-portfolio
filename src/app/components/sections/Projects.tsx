import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { gsap } from "gsap";
import { goToSection, isInteractiveTarget } from "../navigation";
import { PROJECTS } from "./projectData";
import type { Project } from "./projectData";

const LAST = PROJECTS.length - 1;
const unit = (value: number) => Math.max(0, Math.min(1, value));

/** Native vertical flow, with full-bleed backgrounds moving at a slower rate. */
export function Projects() {
  const [active, setActive] = useState(0);
  const [loadedThrough, setLoadedThrough] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<Array<HTMLElement | null>>([]);
  const backdropsRef = useRef<Array<HTMLDivElement | null>>([]);
  const layout = useRef({ anchors: [0], contentStarts: [0], heights: [1], viewport: 1, width: 1 });
  const activeRef = useRef(0);
  const reducedMotion = useRef(false);
  const lastMovement = useRef(0);
  const frame = useRef(0);
  const drag = useRef<{ id: number; start: number; last: number; moved: boolean } | null>(null);

  const paint = useCallback(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const { anchors, contentStarts, heights, viewport } = layout.current;
    const top = flow.scrollTop;
    let index = 0;
    while (index < LAST && top >= (contentStarts[index + 1] ?? Infinity) - viewport * 0.4) index++;
    // A new background arrives with that project's text, including on long phones.
    const blend = contentStarts[index + 1] === undefined ? 0 : unit((top - (contentStarts[index + 1] - viewport * 0.95)) / (viewport * 0.55));
    backdropsRef.current.forEach((backdrop, item) => {
      if (!backdrop) return;
      const opacity = item === index ? 1 : item === index + 1 ? blend : 0;
      gsap.set(backdrop, {
        autoAlpha: opacity,
        y: reducedMotion.current ? 0 : Math.max(-1, Math.min(1, (anchors[item] - top) / viewport)) * viewport * 0.16,
      });
    });
    articlesRef.current.forEach((article, item) => {
      if (!article) return;
      const visible = anchors[item] + heights[item] - top > 80 && anchors[item] - top < viewport - 24;
      article.inert = !visible;
      article.setAttribute("aria-hidden", String(!visible));
    });
    const next = Math.min(LAST, index + (blend >= 0.5 ? 1 : 0));
    if (activeRef.current !== next) {
      activeRef.current = next;
      setActive(next);
      setLoadedThrough((previous) => Math.max(previous, next + 1));
    }
  }, []);

  const goTo = useCallback((index: number, immediate = false) => {
    const next = Math.max(0, Math.min(LAST, index));
    const flow = flowRef.current;
    if (!flow) return;
    setLoadedThrough((previous) => Math.max(previous, next + 1));
    flow.scrollTo({ top: layout.current.anchors[next] ?? 0, behavior: immediate || reducedMotion.current ? "instant" : "smooth" });
    if (immediate) paint();
  }, [paint]);

  // The page delegates input over fixed overlay controls to the same scrollport.
  const scroll = useCallback((pixels: number) => {
    const flow = flowRef.current;
    if (!flow) return false;
    const next = Math.max(0, Math.min(flow.scrollHeight - flow.clientHeight, flow.scrollTop + pixels));
    if (Math.abs(next - flow.scrollTop) < 0.1) return performance.now() - lastMovement.current < 350;
    flow.scrollTop = next;
    return true;
  }, []);

  useLayoutEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const measure = () => {
      const previous = layout.current;
      let index = 0;
      while (index < previous.anchors.length - 1 && flow.scrollTop >= previous.anchors[index + 1]) index++;
      const fraction = unit((flow.scrollTop - previous.anchors[index]) / (previous.anchors[index + 1] - previous.anchors[index] || previous.heights[index]));
      const measured = {
        anchors: articlesRef.current.map((article) => article?.offsetTop ?? 0),
        contentStarts: articlesRef.current.map((article) => article ? article.offsetTop + ((article.firstElementChild as HTMLElement | null)?.offsetTop ?? 0) : 0),
        heights: articlesRef.current.map((article) => article?.offsetHeight ?? 0),
        viewport: flow.clientHeight,
        width: flow.clientWidth,
      };
      layout.current = measured;
      if (previous.width > 1 && (previous.width !== measured.width || previous.viewport !== measured.viewport || previous.heights.some((height, item) => height !== measured.heights[item]))) {
        const span = measured.anchors[index + 1] - measured.anchors[index] || measured.heights[index];
        flow.scrollTo({ top: measured.anchors[index] + fraction * span, behavior: "instant" });
      }
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(flow);
    articlesRef.current.forEach((article) => { if (article) observer.observe(article); });
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => {
    const flow = flowRef.current;
    if (!flow) return;
    const onScroll = () => {
      lastMovement.current = performance.now();
      if (!frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; paint(); });
    };
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => { reducedMotion.current = media.matches; paint(); };
    syncMotion();
    media.addEventListener("change", syncMotion);
    flow.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      flow.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", syncMotion);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [paint]);

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const { id, fromIndex, toIndex } = (event as CustomEvent<{ id: string; fromIndex: number; toIndex: number }>).detail;
      if (id === "projects") goTo(fromIndex < toIndex ? 0 : LAST, true);
    };
    const step = (direction: number) => {
      const next = activeRef.current + direction;
      if (next < 0 || next > LAST) return false;
      goTo(next);
      return true;
    };
    const controls = { id: "projects", axis: "vertical", scroll, step };
    (window as any).__horizontalNav = controls;
    (window as any).__projectsGoTo = goTo;
    (window as any).__projectsSlide = () => activeRef.current;
    window.addEventListener("sectionnavigate", onNavigate);
    return () => {
      window.removeEventListener("sectionnavigate", onNavigate);
      if ((window as any).__horizontalNav === controls) delete (window as any).__horizontalNav;
      delete (window as any).__projectsGoTo;
      delete (window as any).__projectsSlide;
    };
  }, [goTo, scroll]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0 || isInteractiveTarget(event.target)) return;
    drag.current = { id: event.pointerId, start: event.clientY, last: event.clientY, moved: false };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    if (event.buttons === 0) { drag.current = null; return; }
    if (!state.moved && Math.abs(event.clientY - state.start) < 6) return;
    if (!state.moved) event.currentTarget.setPointerCapture(event.pointerId);
    state.moved = true;
    scroll(state.last - event.clientY);
    state.last = event.clientY;
  };
  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
  };

  return (
    <section id="projects" data-snap ref={sectionRef} className="work-gallery relative h-screen w-full overflow-hidden bg-[#121316] text-[#fafafa]" aria-labelledby="work-heading">
      <div className="work-backdrops" aria-hidden="true">
        {PROJECTS.map((project, index) => (
          <div key={project.title} ref={(element) => { backdropsRef.current[index] = element; }} className="work-backdrop">
            <img src={index <= loadedThrough ? project.img : undefined} alt="" draggable={false} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
          </div>
        ))}
      </div>
      <div className="work-overlay" aria-hidden="true" />
      <header className="work-kicker font-cond uppercase"><h2 id="work-heading">Selected work</h2><span>Scroll to explore ↓</span></header>
      <div ref={flowRef} className="work-scroll section-scroll" tabIndex={0} aria-label="Explore projects vertically" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onDragStart={(event) => event.preventDefault()}>
        {PROJECTS.map((project, index) => (
          <article key={project.title} id={`project-${index}`} ref={(element) => { articlesRef.current[index] = element; }} className="work-project" aria-labelledby={`project-title-${index}`} onFocusCapture={(event) => { if ((event.target as HTMLElement).matches(":focus-visible") && activeRef.current !== index) goTo(index); }}>
            <div className="work-content">
              <p className="work-number font-cond uppercase">{String(index + 1).padStart(2, "0")} <span>{project.subtitle}</span></p>
              <h3 id={`project-title-${index}`} className="work-title font-display uppercase">{project.title}</h3>
              <div className="work-details">
                <dl className="work-meta">
                  <div><dt className="font-cond uppercase">Client</dt><dd>{project.client}</dd></div>
                  <div><dt className="font-cond uppercase">Role</dt><dd>{project.role}</dd></div>
                  <div><dt className="font-cond uppercase">Year</dt><dd>{project.year}</dd></div>
                </dl>
                <div>
                  <ProjectSummary project={project} />
                  {project.link && <a className="work-link font-cond uppercase" href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.linkLabel ?? "Visit website"} — ${project.title} (opens in a new tab)`}>{project.linkLabel ?? "Visit website"}<span aria-hidden>↗</span></a>}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <nav className="work-pagination" aria-label="Choose a project">
        <span className="work-count font-cond" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
        <div className="work-dots">
          {PROJECTS.map((project, index) => (
            <button key={project.title} type="button" className="work-dot" onClick={() => goTo(index)} aria-label={`Go to ${project.title}`} title={project.title} aria-controls={`project-${index}`} aria-current={active === index}><span /></button>
          ))}
        </div>
      </nav>
      <button type="button" className="work-about font-cond uppercase" onClick={() => goToSection("about")}>About me ↓</button>
    </section>
  );
}

function ProjectSummary({ project }: { project: Project }) {
  return (
    <div className="work-summary">
      <p>{project.description}</p>
      {project.contribution && (
        <dl>
          <dt className="font-cond uppercase">My contribution</dt><dd>{project.contribution}</dd>
          {project.stack && <><dt className="font-cond uppercase">Built with</dt><dd>{project.stack}</dd></>}
          {project.outcome && <><dt className="font-cond uppercase">Observed outcome</dt><dd>{project.outcome}</dd></>}
        </dl>
      )}
    </div>
  );
}
