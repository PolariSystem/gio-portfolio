import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { DotTitle } from "../DotTitle";
import { Images } from "../../../assets/images";

gsap.registerPlugin(ScrollTrigger);

const PRESENT = Images.digitalPresentations;
const BRAND = Images.brandingPresentations;

const PAD_LEFT = "calc(100vw / 13)";
const PAD_RIGHT = "calc(100vw / 13 * 2)";

export function Presentations() {
  const sec = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  // Title starts writing when the section comes into view.
  useEffect(() => {
    if (!sec.current) return;
    const st = ScrollTrigger.create({
      trigger: sec.current, start: "top 60%", once: true,
      onEnter: () => setStarted(true),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!sec.current) return;
    const imgs = sec.current.querySelectorAll<HTMLElement>("[data-parallax-v]");
    const triggers: ScrollTrigger[] = [];
    imgs.forEach((img) => {
      const t = gsap.fromTo(
        img,
        { scale: 1.05, y: -8 },
        {
          scale: 1, y: 8,
          ease: "none",
          scrollTrigger: { trigger: img.parentElement!, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });
    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      id="presentations"
      data-snap
      ref={sec}
      className="relative h-screen w-full overflow-hidden bg-[#fafafa]"
    >
      {/* Grid — accent column stays black throughout section */}
      <Grid animateIn accentColor="#121316" pulseColor="rgba(18,19,22,0.12)" lineColor="rgba(231,231,232,1)" />

      {/* Sticky title — z-0 so it stays BEHIND the image cards */}
      <div
        className="absolute top-0 left-0 right-0 z-0 pt-24 pointer-events-none"
        style={{ paddingLeft: PAD_LEFT, paddingRight: PAD_RIGHT }}
      >
        <DotTitle
          lines={["Digital Presentations"]}
          start={started}
          className="font-display uppercase text-[#121316]"
          style={{ fontSize: "clamp(28px, 4.5vw, 60px)", fontWeight: 700, lineHeight: 1 }}
        />
        <p className="font-cond uppercase text-[#121316]/40" style={{ fontSize: "clamp(12px, 1vw, 14px)", letterSpacing: "0.1em", marginTop: "0.5rem" }}>
          &amp; Branding.
        </p>
      </div>

      {/* Image grid — z-[2] so it sits ABOVE the title */}
      <div
        className="absolute inset-0 z-[2] flex flex-col"
        style={{ paddingLeft: PAD_LEFT, paddingRight: PAD_RIGHT, paddingTop: "7rem", paddingBottom: "3rem", gap: "clamp(8px, 1.2vh, 16px)" }}
      >
        {/* Row 1: Digital Presentations (4 images) */}
        <div className="flex flex-1 gap-3 min-h-0">
          {PRESENT.map((src, i) => (
            <div
              key={`p-${i}`}
              className="relative flex-1 overflow-hidden bg-[#e7e7e8] shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
            >
              <img
                data-parallax-v
                src={src}
                alt={`Presentation ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          ))}
        </div>

        {/* Row label separator */}
        <div
          className="flex items-center gap-3 flex-shrink-0"
          style={{ paddingTop: "2px", paddingBottom: "2px" }}
        >
          <span className="font-cond uppercase text-[#121316]/30 tracking-widest" style={{ fontSize: "0.7rem" }}>Branding</span>
          <div className="flex-1 h-px bg-[#e7e7e8]" />
        </div>

        {/* Row 2: Branding (3 images) */}
        <div className="flex flex-1 gap-3 min-h-0">
          {BRAND.map((src, i) => (
            <div
              key={`b-${i}`}
              className="relative flex-1 overflow-hidden bg-[#e7e7e8] shadow-[0_2px_16px_rgba(0,0,0,0.10)]"
            >
              <img
                data-parallax-v
                src={src}
                alt={`Branding ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
