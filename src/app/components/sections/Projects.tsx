import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { DotTitle } from "../DotTitle";
import { frame64SvgPaths as svgPaths } from "../../../assets/svgPaths";
import { Images } from "../../../assets/images";
import { useGridSpec, useIsMobile } from "../useMediaQuery";

/**
 * A project panel. Adding a new product to the carousel is just a matter of
 * pushing another entry here — track width, pagination and navigation all
 * derive from this array.
 */
export type Project = {
  title: string;
  subtitle: string;
  client: string;
  role: string;
  year: string;
  description: string;
  link?: string;
  img: string;
};

const PROJECTS: Project[] = [
  {
    title: "Compra Today",
    subtitle: "The best online store with the best prices in Cuba",
    client: "Híper Logística",
    role: "Web Designer",
    year: "2023",
    description:
      "CompraToday provides Híper Logística customers with an easy-to-use platform, boosting online sales by 32% and expanding their market reach across Cuba.",
    link: "https://compratoday.com/",
    img: Images.projectImages[0],
  },
  {
    title: "La Papeleta",
    subtitle: "The official app for cultural events in Cuba",
    client: "Avangenio · Cubarte",
    role: "Mobile Designer",
    year: "2023 - 2024",
    description:
      "Designed for Avangenio S.R.L. and Cubarte, the Ticket increases event attendance and revenue by 42% by providing a seamless ticket purchasing experience for both locals and tourists.",
    link: "https://www.apklis.cu/application/cu.avangenio.lapapeleta.app",
    img: Images.projectImages[1],
  },
  {
    title: "Cuba Adventures",
    subtitle: "Travel and live a life full of adventures",
    client: "Cuba Adventures",
    role: "Product Designer",
    year: "2024",
    description:
      "Cuba Adventures was designed to be a user-friendly platform that showcases the beauty and culture of Cuba. The design allows easier understanding and navigation",
    img: Images.projectImages[2],
  },
  {
    title: "SocIA",
    subtitle: "Connect with SocIA and transform your life",
    client: "Avangenio",
    role: "Product Designer",
    year: "2024 - 2025",
    description:
      "SocIA offers a seamless AI experience, boosting user engagement by 40% and reducing customer support costs by 25%. Its intuitive design and smart features have increased overall satisfaction and optimized business operations.",
    link: "https://socia.avangenio.com/",
    img: Images.projectImages[3],
  },
  {
    title: "Habana Cultural",
    subtitle: "Cultural and events newsletter in Cuba",
    client: "Avangenio",
    role: "Web Designer",
    year: "2025",
    description:
      "Habana Cultural was designed to provide citizens with easy access to the cultural newsletter of Havana. The site's design resulted in a user traffic increase of up to 18% compared to previous years.",
    link: "https://habanacultural.ohc.cu/",
    img: Images.projectImages[4],
  },
  {
    title: "Avancode Challenge",
    subtitle: "Accept the challenge. Define the future",
    client: "Avangenio",
    role: "Product Designer",
    year: "2025",
    description:
      "Designed to highlight the Avancode Challenge 2025 website, emphasizing its role in fostering innovation and talent in the IT sector. Generating 50% more traffic compared to the registrations for the previous year's event.",
    img: Images.projectImages[5],
  },
  {
    title: "Noches de gloria",
    subtitle: "In honor of the Holy Spirit",
    client: "Nexolife",
    role: "Product Designer",
    year: "2025 · 2026",
    description:
      "Event management platform that increased efficiency by 30% and reduced costs by 18% for international evangelical events, thanks to the design and development of a customized system for the Word and Power ministry.",
    img: Images.projectImages[6],
  },
  {
    title: "Avangenio's Website",
    subtitle: "Custom digital solutions",
    client: "Avangenio",
    role: "Web Designer",
    year: "2026",
    description:
      "The complete redesign and development of the platform increased the visibility of the product and the features of AVANGENIO by 32%, attracting both attendees and professionals, while the effort to reach human resources was reduced by 16%.",
    link: "https://avangenio.com/",
    img: Images.projectImages[7],
  },
  {
    title: "Q'Hay",
    subtitle: "Compare prices · Save more",
    client: "Avangenio",
    role: "Web Designer",
    year: "2026",
    description:
      "The complete redesign of the platform increased product visibility and usability by 28%, reducing customer effort to access different products in the market.",
    link: "https://qhay.avangenio.com/es",
    img: Images.projectImages[8],
  }
];

gsap.registerPlugin(ScrollTrigger);

const PANELS = PROJECTS.length + 1; // +1 for the "Featured Projects" intro panel

// SVG paths for "FEATURED" text
const FEATURED_PATHS = [
  svgPaths.p876be80, svgPaths.p13795380, svgPaths.p39a9e3c0, svgPaths.p1972d100,
  svgPaths.p2eaa9380, svgPaths.p175d8b70, svgPaths.p24691540, svgPaths.p27934070,
];
// SVG paths for "PROJECTS" text
const PROJECTS_PATHS = [
  svgPaths.p396a6f00, svgPaths.p3696ba32, svgPaths.p9a61500, svgPaths.p12a81200,
  svgPaths.p1179aa40, svgPaths.p266a3df2, svgPaths.p15406200, svgPaths.p294e9500,
];

// Design tokens taken from the 1920px Figma frame.
const PAD_X = "var(--col)";                     // 148px @1920 — one grid column
const INFO_W = "clamp(300px, calc(var(--col) * 3), 444px)"; // 444px = 3 columns
const GAP_XL = "clamp(2rem, 3.33vw, 4rem)";     // 64px
const PAD_TOP = "clamp(6rem, 6.67vw, 8rem)";    // 128px
const PAD_BOTTOM = "clamp(1.5rem, 2.5vw, 3rem)"; // 48px
const T_TITLE = "clamp(24px, 2.08vw, 40px)";    // 40px
const T_SUB = "clamp(16px, 1.25vw, 24px)";      // 24px
const T_BODY = "clamp(14px, 1.04vw, 20px)";     // 20px

export function Projects() {
  const [slide, setSlide] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const { cols } = useGridSpec();
  const mobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const progress = useRef(0);

  /**
   * Slides the track horizontally. The grid background sits on the (static)
   * section, so only the projects move — nothing drifts or fades underneath.
   * Each inner image drifts a little within its clipped placeholder for a
   * subtle parallax as the carousel scrolls.
   */
  const place = useCallback((p: number) => {
    progress.current = p;
    const w = sectionRef.current?.clientWidth ?? window.innerWidth;
    if (trackRef.current) gsap.set(trackRef.current, { x: -p * w });
    imagesRef.current.forEach((img, i) => {
      if (!img) return;
      const d = p - (i + 1);
      const pos = Math.max(0, Math.min(1, d * 0.8)) * 100;
      gsap.set(img, { objectPosition: `${pos}% 50%` });
    });
  }, []);

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= PANELS) return;
    setSlide(idx);
    gsap.to(progress, {
      current: idx,
      duration: 0.9,
      ease: "power3.inOut",
      onUpdate: () => place(progress.current),
    });
  }, [place]);

  // Panel width / grid column exposed as CSS vars so every measure inside the
  // carousel matches the columns of the sections above and below (the section
  // width excludes the scrollbar, 100vw does not).
  useEffect(() => {
    const sync = () => {
      const el = sectionRef.current;
      if (!el) return;
      el.style.setProperty("--col", `${el.clientWidth / cols}px`);
      place(progress.current);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [place, cols]);

  // Intro wordmarks reveal when the section actually reaches the viewport.
  useEffect(() => {
    if (!sectionRef.current) return;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current, start: "top 70%", once: true,
      onEnter: () => setIntroReady(true),
    });
    return () => st.kill();
  }, []);

  // The shots past the first are lazy, and a horizontally parked panel counts
  // as off-screen — so warm the neighbours of the current panel. By the time a
  // panel slides in its image is already decoded and there is no pop-in.
  useEffect(() => {
    [slide, slide + 1, slide - 1]
      .map((panel) => PROJECTS[panel - 1])
      .filter(Boolean)
      .forEach((p) => {
        const img = new Image();
        img.decoding = "async";
        img.src = p.img;
      });
  }, [slide]);

  // While this section is the active snap, vertical intent moves the carousel
  // horizontally; returning false lets the page snap to the next section.
  useEffect(() => {
    (window as any).__horizontalNav = {
      id: "projects",
      step: (dir: number) => {
        const next = slide + dir;
        if (next < 0 || next >= PANELS) return false;
        goTo(next);
        return true;
      },
    };
    return () => { delete (window as any).__horizontalNav; };
  }, [goTo, slide]);

  // Expose goTo for external navigation
  useEffect(() => {
    (window as any).__projectsGoTo = goTo;
    (window as any).__projectsSlide = () => slide;
    return () => {
      delete (window as any).__projectsGoTo;
      delete (window as any).__projectsSlide;
    };
  }, [goTo, slide]);

  // Keyboard left/right while the section is the active snap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const snaps = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
      const projIdx = snaps.indexOf(document.getElementById("projects") as HTMLElement);
      if ((window as any).__currentSnapIdx !== projIdx) return;
      if (e.key === "ArrowRight") goTo(slide + 1);
      if (e.key === "ArrowLeft") goTo(slide - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, slide]);

  return (
    <section
      id="projects"
      data-snap
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#fafafa]"
    >
      {/* Static background — shared by every project panel, never moves */}
      <Grid animateIn showAccent={false} lineColor="rgba(231,231,232,1)" />

      <div
        ref={trackRef}
        className="relative z-[2] flex h-full will-change-transform"
        style={{ width: `${PANELS * 100}%` }}
      >
        {/* ─── Panel 0: FEATURED PROJECTS (dark, opaque — slides away) ─── */}
        <div className="relative flex h-full flex-shrink-0 flex-col bg-[#121316]" style={{ width: `${100 / PANELS}%` }}>
          <Grid dark animateIn showAccent={false} lineColor="rgba(37,38,40,1)" />

          {/* Last column stays light and carries the scroll hint. On a phone
              that column is the accent rail the section navigation lives in,
              so the hint moves to the bottom of the panel instead. */}
          {!mobile && (
            <div className="pointer-events-none absolute inset-0 z-[6] site-grid">
              <div className="col-last flex h-full flex-col items-center justify-center gap-3 bg-[#fafafa]">
                <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 23L13 13L3 3" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {mobile && (
            <div
              className="pointer-events-none absolute z-[6] flex items-center"
              style={{ left: "var(--gutter)", bottom: 28, gap: 8, color: "#fafafa", opacity: 0.7 }}
            >
              <span className="font-cond uppercase" style={{ fontSize: 11, letterSpacing: "0.18em" }}>
                Swipe to browse
              </span>
              <svg width="10" height="16" viewBox="0 0 16 26" fill="none" style={{ animation: "blink 1.4s steps(1) infinite" }}>
                <path d="M3 23L13 13L3 3" stroke="#fafafa" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          <div
            className="relative z-[5] flex h-full flex-col justify-center"
            style={{
              paddingLeft: mobile ? "var(--gutter)" : PAD_X,
              paddingRight: mobile ? "var(--content-pad-right)" : PAD_X,
              gap: mobile ? "20px" : "clamp(48px, 6.67vw, 128px)",
            }}
          >
            {/* Row 1: FEATURED ▪ — wipes in from the left */}
            <div className="flex items-center" style={{ gap: mobile ? "14px" : "clamp(24px, 12.8vw, 246px)" }}>
              <div
                style={{
                  width: mobile ? "min(1032px, 66vw)" : "min(1032px, 53.75vw)",
                  clipPath: introReady ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  transition: "clip-path 1.1s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <svg viewBox="0 0 1032 195" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>
                  {FEATURED_PATHS.map((d, i) => <path key={i} d={d} fill="white" />)}
                </svg>
              </div>
              <div
                style={{
                  width: "clamp(24px, 2.5vw, 48px)",
                  height: "clamp(24px, 2.5vw, 48px)",
                  background: "white",
                  flexShrink: 0,
                  opacity: introReady ? 1 : 0,
                  transition: "opacity 0.5s ease 0.9s",
                }}
              />
            </div>

            {/* Row 2: ▪ PROJECTS — wipes in from the right */}
            <div className="flex items-center" style={{ gap: mobile ? "14px" : "clamp(24px, 12.8vw, 246px)" }}>
              <div
                style={{
                  width: "clamp(24px, 2.5vw, 48px)",
                  height: "clamp(24px, 2.5vw, 48px)",
                  background: "white",
                  flexShrink: 0,
                  opacity: introReady ? 1 : 0,
                  transition: "opacity 0.5s ease 0.9s",
                }}
              />
              <div
                style={{
                  width: mobile ? "min(1032px, 66vw)" : "min(1032px, 53.75vw)",
                  clipPath: introReady ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
                  transition: "clip-path 1.1s cubic-bezier(0.22,1,0.36,1) 0.35s",
                }}
              >
                <svg viewBox="0 0 1032 195" fill="none" style={{ width: "100%", height: "auto", display: "block" }}>
                  {PROJECTS_PATHS.map((d, i) => <path key={i} d={d} fill="white" />)}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Panels 1..n: one per project (light) ─── */}
        {PROJECTS.map((p, i) => (
          <ProjectPanel
            key={p.title}
            project={p}
            index={i}
            active={slide === i + 1}
            eager={i === 0}
            // Panel i lives at slide i+1, so `i <= slide` is "the one on screen,
            // the one after it, and everything already seen" — never all nine.
            load={i <= slide}
            mobile={mobile}
            imgRef={(el) => { imagesRef.current[i] = el; }}
          />
        ))}
      </div>

      {/* Static pagination — lives on the section, so it never moves with the
          track. Only shown while a project (not the intro) is on screen. */}
      <div
        className="pointer-events-none absolute z-[6] flex items-center justify-between"
        style={{
          left: mobile ? "var(--gutter)" : "50%",
          right: mobile ? "var(--content-pad-right)" : undefined,
          bottom: mobile ? 20 : PAD_BOTTOM,
          transform: mobile ? undefined : "translateX(-50%)",
          width: mobile ? undefined : INFO_W,
          opacity: slide >= 1 ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {PROJECTS.map((q, j) => (
          <button
            key={q.title}
            onClick={() => goTo(j + 1)}
            aria-label={`Go to ${q.title}`}
            aria-current={slide === j + 1}
            className="pointer-events-auto"
            style={{
              width: "clamp(10px, 0.75vw, 16px)",
              height: "clamp(10px, 0.75vw, 16px)",
              background: slide === j + 1 ? "#121316" : "#e7e7e8",
              border: "none",
              padding: 0,
              cursor: "none",
              transition: "background 0.3s ease",
              // A 10px square is an unhittable target on a phone; the outline
              // stays 10px while the touch area grows around it. The padding is
              // biased downwards into empty space so the target does not reach
              // up into the panel's copy.
              ...(mobile
                ? { boxSizing: "content-box" as const, borderTop: "8px solid transparent", borderBottom: "16px solid transparent", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", backgroundClip: "content-box" as const }
                : null),
            }}
          />
        ))}
      </div>
    </section>
  );
}

type PanelProps = {
  project: Project;
  index: number;
  active: boolean;
  /** First shot is fetched up front; the rest stream in as you advance. */
  eager: boolean;
  /** Whether this panel's shot may be requested yet. */
  load: boolean;
  mobile: boolean;
  imgRef: (el: HTMLImageElement | null) => void;
};

function ProjectPanel({ project, index, active, eager, load, mobile, imgRef }: PanelProps) {
  const shot = (
    <img
      ref={imgRef}
      src={load ? project.img : undefined}
      alt={project.title}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...{ fetchpriority: eager ? "high" : "low" }}
      className="absolute inset-0 h-full w-full object-cover object-left will-change-transform"
    />
  );

  /**
   * Phone panel: the desktop split puts a fixed 300px copy column beside the
   * shot, which at 390px left the image exactly 0px wide. Stacked instead —
   * shot on top, copy beneath — so the work is actually the hero of the panel.
   */
  if (mobile) {
    return (
      <div className="relative flex h-full flex-shrink-0 flex-col" style={{ width: `${100 / PANELS}%` }}>
        <div
          className="relative z-[5] flex h-full flex-col"
          style={{
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--content-pad-right)",
            paddingTop: "var(--panel-pad-top)",
            paddingBottom: 60,
            gap: 14,
          }}
        >
          {/* Device shot */}
          <div
            className="relative w-full shrink-0 overflow-hidden"
            style={{
              height: "var(--shot-h)",
              background: "linear-gradient(90deg, rgba(18,19,22,0.08) 0%, rgba(18,19,22,0.08) 100%), #ffffff",
              boxShadow: "0px 4px 16px 0px rgba(0,0,0,0.16)",
              padding: 10,
            }}
          >
            <div className="relative h-full w-full overflow-hidden" style={{ boxShadow: "0px 4px 16px 2px rgba(0,0,0,0.24)" }}>
              {shot}
            </div>
          </div>

          {/* Copy */}
          <div className="flex min-h-0 flex-1 flex-col" style={{ gap: 10 }}>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <DotTitle
                as="h3"
                key={`title-${index}-${active}`}
                lines={[project.title]}
                start={active}
                className="font-display uppercase text-[#121316]"
                style={{ fontSize: 24, lineHeight: 1, fontWeight: 700 }}
              />
              <p className="font-sans text-[#121316]" style={{ fontSize: 14, lineHeight: 1.25, margin: 0, opacity: 0.75 }}>
                {project.subtitle}
              </p>
            </div>

            <div className="flex flex-col" style={{ gap: 6 }}>
              <DetailRow label="Client:" value={project.client} rule />
              <DetailRow label="Role:" value={project.role} rule />
              <DetailRow label="Year:" value={project.year} />
            </div>

            <p className="font-sans text-[#121316]" style={{ fontSize: 13, lineHeight: 1.35, margin: 0 }}>
              {project.description}
            </p>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                // Deliberately NOT pushed to the bottom of the column: the
                // pagination band lives down there, and its touch targets sat
                // straight on top of this link. Sitting right after the copy
                // leaves the leftover space as clearance.
                className="font-display flex w-fit items-center self-start"
                style={{ gap: "4px", color: "#121316", fontSize: 14, lineHeight: 1.1, fontWeight: 500, paddingTop: 4 }}
              >
                <span className="underline">View live website</span>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: "1.2em", height: "1.2em" }}>
                  <path d="M7 17 17 7M9 7h8v8" stroke="#121316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-shrink-0 flex-col" style={{ width: `${100 / PANELS}%` }}>
      {/* transparent — the section's static grid shows through */}
      <div
        className="relative z-[5] flex h-full flex-col items-center"
        style={{
          paddingLeft: PAD_X,
          paddingRight: PAD_X,
          paddingTop: PAD_TOP,
          // room for the static pagination row that overlays the bottom
          paddingBottom: `calc(${PAD_BOTTOM} + ${GAP_XL})`,
        }}
      >
        <div className="flex min-h-0 w-full flex-1 items-stretch">
          {/* Left column — copy */}
          <div
            className="flex shrink-0 flex-col justify-end"
            style={{ width: INFO_W, paddingRight: "clamp(12px, 1.25vw, 24px)", paddingTop: "clamp(12px, 1.25vw, 24px)", paddingBottom: "clamp(12px, 1.25vw, 24px)", gap: "clamp(12px, 1.25vw, 24px)" }}
          >
            {/* Header */}
            <div className="flex flex-col" style={{ gap: "8px" }}>
              <DotTitle
                as="h3"
                key={`title-${index}-${active}`}
                lines={[project.title]}
                start={active}
                className="font-display uppercase text-[#121316]"
                style={{ fontSize: T_TITLE, lineHeight: 1, fontWeight: 700 }}
              />
              <p className="font-sans text-[#121316]" style={{ fontSize: T_SUB, lineHeight: 1.2, margin: 0 }}>
                {project.subtitle}
              </p>
            </div>

            {/* Client / Role / Year */}
            <div className="flex flex-col" style={{ gap: "clamp(8px, 0.83vw, 16px)" }}>
              <DetailRow label="Client:" value={project.client} rule />
              <DetailRow label="Role:" value={project.role} rule />
              <DetailRow label="Year:" value={project.year} />
            </div>

            <p className="font-sans text-[#121316]" style={{ fontSize: T_BODY, lineHeight: 1.2, margin: 0 }}>
              {project.description}
            </p>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="font-display flex items-center transition-opacity hover:opacity-70"
                style={{ gap: "4px", color: "#121316", fontSize: T_BODY, lineHeight: 1.1, fontWeight: 500 }}
              >
                <span className="underline">View live website</span>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: "1.2em", height: "1.2em" }}>
                  <path d="M7 17 17 7M9 7h8v8" stroke="#121316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>

          {/* Right column — device shot */}
          <div
            className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(90deg, rgba(18,19,22,0.08) 0%, rgba(18,19,22,0.08) 100%), #ffffff",
              boxShadow: "0px 4px 16px 0px rgba(0,0,0,0.16)",
              padding: "clamp(16px, 1.75vw, 24px)",
            }}
          >
            {/* Placeholder clips the shot; the image fills the full height and
                scales horizontally (it may overflow the sides — that's fine). */}
            <div
              className="relative h-full w-full overflow-hidden"
              style={{ boxShadow: "0px 4px 16px 2px rgba(0,0,0,0.24)" }}
            >
              {shot}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, rule = false }: { label: string; value: string; rule?: boolean }) {
  return (
    <div className="flex w-full flex-col" style={{ gap: "clamp(8px, 0.83vw, 16px)" }}>
      <div className="flex w-full items-center justify-between whitespace-nowrap text-[#121316]" style={{ fontSize: T_BODY, lineHeight: 1.2 }}>
        <span className="font-sans">{label}</span>
        <span className="font-display uppercase" style={{ fontWeight: 700 }}>{value}</span>
      </div>
      {rule && <div style={{ height: 1, width: "100%", background: "#e7e7e8" }} />}
    </div>
  );
}
