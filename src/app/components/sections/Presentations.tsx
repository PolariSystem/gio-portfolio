import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { DotTitle } from "../DotTitle";
import p1 from "../../../imports/Frame31/7c27aab20e944b607f15db084693878a2e4e11a5.png";
import p2 from "../../../imports/Frame31/91ff197f82cb65367b145d53598641c9e3a77416.png";
import p3 from "../../../imports/Frame31/eb4aa884bffcf5e092bb24e2894e2599c4da5d16.png";
import p4 from "../../../imports/Frame31/a6006e95b7b5b31b5d08bfb7fc66c7c14efaba8f.png";
import b1 from "../../../imports/Frame32/69185f4df665c7fccc5886b35e26ef530fcfc4c7.png";
import b2 from "../../../imports/Frame32/24b82f772f5c7d64433c687c725432210f5ac21e.png";
import b3 from "../../../imports/Frame32/d54be067e3d50484e4dd770d3fcc05261b7ea229.png";

gsap.registerPlugin(ScrollTrigger);

const PRESENT = [p1, p2, p3, p4];
const BRAND = [b1, b2, b3];

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
