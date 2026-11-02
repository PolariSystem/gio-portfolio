import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DotTitle } from "../DotTitle";
import { MaskParagraph } from "../MaskParagraph";
import { Images } from "../../../assets/images";
import { useIsMobile } from "../useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

const BIO = "I turn product requirements into clear digital experiences. My work spans UX/UI design, responsive interfaces, and team coordination, with hands-on frontend contributions when a project calls for them.";
const APPROACH = [
  { title: "Clarify", description: "Map the problem, flows, and priorities." },
  { title: "Design", description: "Define interfaces, components, and states." },
  { title: "Connect", description: "Prototype, document, and refine with development." },
];

export function About() {
  const sec = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [started, setStarted] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    const context = gsap.context(() => {
      ScrollTrigger.create({ trigger: sec.current, start: "top 60%", once: true, onEnter: () => setStarted(true) });
      gsap.set(imgRef.current, { clipPath: "inset(0 0% 0 100%)" });
      const reveal = () => { gsap.to(imgRef.current, { clipPath: "inset(0 0% 0 0%)", duration: 1, ease: "power2.out", overwrite: true }); };
      const hide = () => { gsap.to(imgRef.current, { clipPath: "inset(0 0% 0 100%)", duration: 0.4, ease: "power2.in", overwrite: true }); };
      ScrollTrigger.create({ trigger: sec.current, start: "center bottom", end: "bottom center", onEnter: reveal, onEnterBack: reveal, onLeave: hide, onLeaveBack: hide });
    }, sec);
    return () => context.revert();
  }, []);

  return (
    <section ref={sec} id="about" data-snap className="relative h-screen w-full overflow-hidden text-[#fafafa]">
      {mobile ? (
        <div className="about-portrait pointer-events-none absolute left-0 top-0 z-[3] overflow-hidden" style={{ height: "var(--about-portrait-height, 38dvh)", right: 40 }}>
          <img src={Images.aboutPortrait} alt="Giovany Cruz" decoding="async" {...{ fetchpriority: "low" }} className="h-full w-full object-cover" style={{ objectPosition: "50% 16%" }} ref={imgRef} />
        </div>
      ) : (
        <div className="absolute inset-0 z-[3] site-grid pointer-events-none">
          <div className="h-full overflow-hidden" style={{ gridColumn: "var(--portrait-col)" }}>
            <img src={Images.aboutPortrait} alt="Giovany Cruz" decoding="async" {...{ fetchpriority: "low" }} className="h-full w-full object-cover object-bottom" ref={imgRef} />
          </div>
        </div>
      )}
      <div className={`section-scroll about-content relative z-[5] flex h-full flex-col ${mobile ? "justify-start" : "justify-center"}`} style={{
        paddingLeft: "var(--gutter)", paddingRight: mobile ? "var(--content-pad-right)" : "var(--gutter)",
        paddingTop: mobile ? "calc(var(--about-portrait-height, 38dvh) + 20px)" : "clamp(6rem, 12vh, 8rem)",
        paddingBottom: mobile ? 24 : "clamp(4rem, 12vh, 8rem)",
      }}>
        <div className="flex shrink-0 flex-col items-start" style={{ gap: mobile ? 16 : 24, maxWidth: mobile ? "100%" : "min(590px, var(--about-copy-width))" }}>
          <DotTitle lines={["About me"]} start={started} onDone={() => setTitleDone(true)} className="font-display uppercase" style={{ fontSize: "var(--text-heading)", lineHeight: 1, fontWeight: 700, letterSpacing: "0.02em" }} />
          <MaskParagraph text={BIO} start={titleDone} style={{ width: "100%", fontSize: "var(--text-lead)", lineHeight: "var(--leading-body)" }} />
          <ol className="about-approach" aria-label="My design approach" style={{ opacity: titleDone ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}>
            {APPROACH.map((step, i) => (
              <li key={step.title}>
                <div className="about-step-heading font-cond uppercase"><span aria-hidden>0{i + 1}</span><h3>{step.title}</h3></div>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
