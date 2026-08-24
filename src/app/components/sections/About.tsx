import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { DotTitle } from "../DotTitle";
import { Typewriter } from "../Typewriter";
import { MaskParagraph } from "../MaskParagraph";
import { about3SvgPaths as svgPaths } from "../../../assets/svgPaths";
import { Images } from "../../../assets/images";
import { useIsMobile } from "../useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

const BIO =
  "Expertise in building scalable Design Systems and cohesive Brand Identities including logos and iconography. I bridge business goals and user-centered design to deliver measurable growth and seamless digital experiences.";

const CONTACT_ICON_SIZE = "clamp(1.5rem, 2vw, 2rem)";

const CONTACTS = [
  {
    label: "imgiovanycruz@gmail.com",
    // Opens the Gmail compose window addressed to Giovany
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=imgiovanycruz@gmail.com",
    icon: <GmailIcon />,
  },
  {
    label: "@imgiovanycruz",
    href: "https://t.me/imgiovanycruz",
    icon: <TelegramIcon />,
  },
  {
    label: "Giovany Cruz",
    href: "https://www.linkedin.com/in/giovany-cruz-0844a0280",
    icon: <LinkedinIcon />,
  },
  {
    label: "Gio.",
    href: "https://www.behance.net/giovanycruzca",
    icon: <BehanceIcon />,
  },
];

export function About() {
  const sec = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [titleDone, setTitleDone] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const mobile = useIsMobile();

  useEffect(() => {
    if (!sec.current) return;
    const st = ScrollTrigger.create({
      trigger: sec.current,
      start: "top 60%",
      once: true,
      onEnter: () => {
        setStarted(true);
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!imgRef.current || !sec.current) return;
    // Configuración inicial: imagen oculta (recortada desde la derecha)
    gsap.set(imgRef.current, { clipPath: "inset(0 0% 0 100%)" });
    // Crear ScrollTrigger para la animación
    const st = ScrollTrigger.create({
      trigger: sec.current,
      start: "center bottom", // cuando el borde superior de la sección toca el inferior del viewport
      end: "bottom center", // cuando el borde inferior toca el superior
      toggleActions: "play reverse play reverse", // entra: play, sale: reverse
      onEnter: () => {
        gsap.to(imgRef.current, {
          clipPath: "inset(0 0% 0 0%)",
          duration: 1,
          ease: "power2.out",
        });
      },
      onLeave: () => {
        gsap.to(imgRef.current, {
          clipPath: "inset(0 0% 0 100%)",
          duration: 0.4,
          ease: "power2.in",
        });
      },
      onEnterBack: () => {
        gsap.to(imgRef.current, {
          clipPath: "inset(0 0% 0 0%)",
          duration: 1,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(imgRef.current, {
          clipPath: "inset(0 0% 0 100%)",
          duration: 0.4,
          ease: "power2.in",
        });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={sec}
      id="about"
      data-snap
      className="relative h-screen w-full overflow-hidden bg-[#fafafa] text-[#121316]"
    >
      <Grid
        animateIn
        accentColor="#121316"
        pulseColor="rgba(18,19,22,0.18)"
        lineColor="rgba(231,231,232,1)"
      />

      {/* Portrait — desktop: the right-hand columns. Phone: a full-bleed band
          across the top, with the copy stacked underneath instead of behind it
          (at 390px the portrait sat straight on top of the text). */}
      {mobile ? (
        // Stops at the accent rail rather than running under it, so the
        // section markers stay legible over their own colour.
        <div
          className="pointer-events-none absolute left-0 top-0 z-[3] overflow-hidden"
          style={{ height: "38dvh", right: 40 }}
        >
          <img
            src={Images.aboutPortrait}
            alt="Giovany Cruz"
            decoding="async"
            {...{ fetchpriority: "low" }}
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 16%" }}
            ref={imgRef}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-[3] site-grid pointer-events-none">
          <div className="col-start-8 col-span-5 h-full overflow-hidden">
            <img
              src={Images.aboutPortrait}
              alt="Giovany Cruz"
              decoding="async"
              {...{ fetchpriority: "low" }}
              className="h-full w-full object-cover object-bottom"
              ref={imgRef}
            />
          </div>
        </div>
      )}
      <div
        className={`relative z-[5] flex h-full flex-col ${mobile ? "justify-start" : "justify-center"}`}
        style={{
          paddingLeft: "var(--gutter)",
          paddingRight: mobile ? "var(--content-pad-right)" : "var(--gutter)",
          paddingTop: mobile ? "calc(38dvh + 20px)" : "clamp(6rem, 12vh, 8rem)",
          paddingBottom: mobile ? "20px" : "clamp(4rem, 12vh, 8rem)",
        }}
      >
        <div
          className="flex flex-col items-start"
          style={{ gap: mobile ? "1rem" : "clamp(1.5rem, 1.67vw, 2rem)" }}
        >
          <DotTitle
            lines={["About me"]}
            start={started}
            onDone={() => setTitleDone(true)}
            className="font-display uppercase"
            style={{
              fontSize: "clamp(1.75rem, 2.08vw, 2.5rem)",
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          />

          <div
            ref={bioRef}
            className="flex flex-col items-start"
            style={{
              gap: mobile ? "0.875rem" : "clamp(1rem, 1.25vw, 1.5rem)",
              maxWidth: "min(590px, 100%)",
            }}
          >
            <MaskParagraph
              text={BIO}
              start={titleDone}
              style={{
                width: "100%",
                fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
                lineHeight: 1.2,
              }}
            />

            <div
              className="flex flex-col items-start"
              style={{
                gap: mobile ? "0.75rem" : "clamp(1rem, 1.25vw, 1.5rem)",
              }}
            >
              {titleDone &&
                CONTACTS.map((c, i) => (
                  <a
                    key={c.href}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center transition-opacity hover:opacity-70"
                    style={{ gap: "1rem", color: "#121316" }}
                  >
                    <span
                      className="flex shrink-0 items-center justify-center"
                      style={{
                        width: CONTACT_ICON_SIZE,
                        height: CONTACT_ICON_SIZE,
                      }}
                    >
                      {c.icon}
                    </span>
                    <Typewriter
                      as="span"
                      text={c.label}
                      delay={700 + i * 300}
                      speed={28}
                      className="underline"
                      style={{
                        fontSize: "clamp(1rem, 1.25vw, 1.5rem)",
                        fontWeight: 700,
                        lineHeight: 1.2,
                      }}
                    />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GmailIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
      <path d={svgPaths.pd83b80} fill="#121316" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
      <path
        d="M14.969 24.6198L12.9119 26.3098L9.82623 17.8592L1.59766 15.155L30.3976 4L25.2548 28L13.2548 19.2113L23.7814 10.1935"
        stroke="#121316"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
      <path d={svgPaths.p1c010510} fill="#121316" />
      <path d={svgPaths.p169adf00} fill="#121316" />
      <path d={svgPaths.p25ea9600} fill="#121316" />
    </svg>
  );
}

function BehanceIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
      <path d={svgPaths.p5d68a00} fill="#121316" />
      <path d={svgPaths.pd276f00} fill="#121316" />
      <path d={svgPaths.p21421000} fill="#121316" />
    </svg>
  );
}
