import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Grid } from "./Grid";

type Props = {
  /** Flips to true once fonts and the deferred section chunks have landed. */
  ready: boolean;
  /** Fired as the curtain starts lifting, so the hero intro plays with it. */
  onReveal: () => void;
  /** Floor for how long the loader stays up, so it never just flashes. */
  minMs?: number;
};

const CRAWL_TO = 90;

/**
 * First-paint curtain. It uses the same ink, grid and dot-caret vocabulary as
 * the hero, so the reveal reads as the first beat of the site rather than a
 * separate loading screen: the counter writes up, then the whole panel lifts
 * away and hands the intro over to the hero underneath.
 */
export function Preloader({ ready, onReveal, minMs = 600 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counter = useRef({ v: 0 });
  const crawl = useRef<gsap.core.Tween | null>(null);
  const mountedAt = useRef(0);
  const leaving = useRef(false);
  const [gone, setGone] = useState(false);

  // Writes straight to the DOM — a counter that re-rendered React 60x a second
  // would compete with the grid animation for the same frames.
  const paint = () => {
    const v = counter.current.v;
    if (numRef.current) numRef.current.textContent = String(Math.round(v)).padStart(2, "0");
    if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
  };

  useEffect(() => {
    mountedAt.current = performance.now();
    // Crawl toward 90 while the real work is in flight; `ready` finishes it.
    crawl.current = gsap.to(counter.current, {
      v: CRAWL_TO,
      duration: 2.6,
      ease: "power2.out",
      onUpdate: paint,
    });
    return () => {
      crawl.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!ready || leaving.current) return;
    leaving.current = true;

    // The crawl must die first: two live tweens writing the same value fight
    // every frame, and the slower one drags the counter backwards.
    crawl.current?.kill();

    const wait = Math.max(0, minMs - (performance.now() - mountedAt.current));

    const tl = gsap.timeline({ delay: wait / 1000 });
    tl.to(counter.current, {
      v: 100,
      duration: 0.35,
      ease: "power2.out",
      onUpdate: paint,
    });
    // The counter block clears out first, then the panel itself lifts.
    tl.to("[data-preloader-copy]", { yPercent: -110, opacity: 0, duration: 0.45, ease: "power3.in" }, "+=0.06");
    tl.to(
      root.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
        onStart: onReveal,
        onComplete: () => setGone(true),
      },
      "-=0.2",
    );

    return () => {
      tl.kill();
    };
  }, [ready, minMs, onReveal]);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="preloader-root fixed inset-0 z-[10000] overflow-hidden bg-[#121316] text-[#fafafa]"
      style={{ willChange: "transform" }}
    >
      <Grid dark animateIn accentColor="#fafafa" />

      <div
        className="site-content relative z-[5] flex h-full flex-col justify-end"
        style={{ paddingBottom: "clamp(4rem, 12vh, 8rem)" }}
      >
        <div data-preloader-copy className="flex w-full flex-col" style={{ gap: "clamp(1rem, 1.25vw, 1.5rem)" }}>
          <div className="flex items-center" style={{ gap: "12px" }}>
            <span
              className="inline-block flex-shrink-0"
              style={{ height: 8, width: 8, background: "#fafafa", animation: "blink 1.2s steps(1) infinite" }}
            />
            <span className="font-sans" style={{ fontSize: "clamp(0.875rem, 1.04vw, 1.25rem)", letterSpacing: "0.04em" }}>
              Loading
            </span>
          </div>

          <div className="flex items-end" style={{ gap: "8px" }}>
            <span
              ref={numRef}
              className="font-display uppercase tabular-nums"
              style={{ fontSize: "clamp(2rem, 4.17vw, 5rem)", lineHeight: 1, color: "#fafafa" }}
            >
              00
            </span>
            <span
              className="font-display uppercase"
              style={{ fontSize: "clamp(1rem, 1.25vw, 1.5rem)", lineHeight: 1.6, opacity: 0.5 }}
            >
              %
            </span>
          </div>

          {/* Progress rule — spans the content column like the section rules */}
          <div className="relative w-full" style={{ height: 1, background: "rgba(250,250,250,0.18)" }}>
            <div
              ref={barRef}
              className="absolute inset-0"
              style={{ background: "#fafafa", transformOrigin: "left center", transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
