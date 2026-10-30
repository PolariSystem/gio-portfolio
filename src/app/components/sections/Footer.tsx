import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Grid } from "../Grid";
import { BrandMark } from "../BrandMark";
import { ActionButton } from "../ActionButton";
import { ActionLink } from "../ActionLink";
import { MaskText } from "../MaskText";
import { useGridSpec, useMediaQuery } from "../useMediaQuery";
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF, PROFILE_LINKS } from "../../contact";
import { goToSection } from "../navigation";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { cols } = useGridSpec();
  const compact = useMediaQuery("(max-width: 1100px)");
  const split = Math.ceil((cols - 2) / 2) + 1;
  const leftColumn = compact ? "1 / -1" : `1 / ${split}`;
  const rightColumn = compact ? "1 / -1" : `${split} / -1`;
  const columns = compact ? "minmax(0, 1fr)" : "repeat(var(--desktop-inner-cols, 11), minmax(0, 1fr))";

  useEffect(() => {
    if (!ref.current) return;
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          gsap.fromTo("[data-footer-reveal]", { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
          });
        },
      });
    }, ref);
    return () => context.revert();
  }, []);

  return (
    <section ref={ref} id="footer" data-snap aria-labelledby="contact-heading" className="relative h-screen w-full overflow-hidden bg-[#121316] text-[#fafafa]">
      <Grid dark animateIn accentColor="#121316" />
      <footer className="footer-content section-scroll relative z-10">
        <div className="footer-kicker font-cond uppercase" data-footer-reveal>
          <span aria-hidden className="footer-square" />
          Roles &amp; collaborations
        </div>

        <div className="footer-main" style={{ gridTemplateColumns: columns }}>
          <div className="footer-intro" style={{ gridColumn: leftColumn }}>
            <h2 id="contact-heading" className="footer-heading font-display uppercase">
              <MaskText lines={["Let's shape", "what's next."]} />
            </h2>
            <p className="footer-description">
              Product design roles, UX/UI projects, and design systems that need to scale.
            </p>
          </div>

          <div className="footer-contact" style={{ gridColumn: rightColumn }} data-footer-reveal>
            <p className="footer-label font-cond uppercase">Start a conversation</p>
            <a className="footer-email" href={CONTACT_EMAIL_HREF}>
              <span>{CONTACT_EMAIL}</span>
              <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
            <p className="footer-prompt">Tell me about the product, the challenge, and the role.</p>
            <nav className="footer-socials" aria-label="Professional profiles and direct message">
              {PROFILE_LINKS.map((link) => (
                <ActionLink key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`}>
                  {link.label}
                </ActionLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="footer-bottom" style={{ gridTemplateColumns: columns }} data-footer-reveal>
          <button className="footer-brand-button" type="button" aria-label="Gio. — back to top" onClick={() => goToSection("hero")} style={{ gridColumn: leftColumn }}>
            <BrandMark className="footer-brand" />
          </button>
          <div className="footer-meta" style={{ gridColumn: rightColumn }}>
            <p className="footer-copyright">© {new Date().getFullYear()} Giovany Cruz</p>
            <ActionButton tone="light" size="nav" onClick={() => goToSection("hero")} style={{ minHeight: 44, padding: "10px 0" }}>
              Back to top ↑
            </ActionButton>
          </div>
        </div>
      </footer>
    </section>
  );
}
