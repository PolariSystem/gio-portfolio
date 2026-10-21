import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cursor } from "./components/Cursor";
import { Navbar } from "./components/Navbar";
import { SectionRail } from "./components/SectionRail";
import { Preloader } from "./components/Preloader";
import { Hero } from "./components/sections/Hero";
import { canScrollWithin, isInteractiveTarget } from "./components/navigation";

gsap.registerPlugin(ScrollTrigger);

/**
 * Only the hero ships in the first chunk. Everything below the fold is split
 * out and fetched while the preloader is on screen, so the browser can paint
 * something branded almost immediately instead of parsing the whole site
 * (charts included) before the first frame.
 *
 * The imports are hoisted into named thunks because the preloader awaits the
 * very same promises the lazy components consume — module promises are cached,
 * so by the time the curtain lifts every section is already resolved and the
 * fallbacks below never actually paint.
 */
const importAbout = () => import("./components/sections/About");
const importServices = () => import("./components/sections/Services");
const importProjects = () => import("./components/sections/Projects");
const importFooter = () => import("./components/sections/Footer");

const About = lazy(() => importAbout().then((m) => ({ default: m.About })));
const Services = lazy(() => importServices().then((m) => ({ default: m.Services })));
const Projects = lazy(() => importProjects().then((m) => ({ default: m.Projects })));
const Footer = lazy(() => importFooter().then((m) => ({ default: m.Footer })));

/**
 * Stand-in that keeps a `[data-snap]` element of the right height and colour in
 * the DOM while a chunk is in flight. Without it the snap indices — which are
 * derived from the DOM order of `[data-snap]` — would shift as sections arrive.
 */
function SnapFallback({ dark = false }: { dark?: boolean }) {
  return (
    <section
      data-snap
      aria-hidden
      className={`relative h-screen w-full overflow-hidden ${dark ? "bg-[#121316]" : "bg-[#fafafa]"}`}
    />
  );
}

const fontsSettled = () =>
  document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();

const afterIdle = (fn: () => void) => {
  const ric = (window as any).requestIdleCallback as
    | ((cb: () => void, opts?: { timeout: number }) => number)
    | undefined;
  if (ric) return ric(fn, { timeout: 2000 });
  return window.setTimeout(fn, 300);
};

export default function App() {
  const [bootReady, setBootReady] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Fonts + every deferred section, with a hard cap so a slow font CDN or a
  // failed chunk can never leave the visitor stuck behind the curtain.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setBootReady(true);
    };

    Promise.all([
      importAbout(),
      importServices(),
      importProjects(),
      importFooter(),
      fontsSettled(),
    ])
      .then(finish)
      .catch(finish);

    const cap = window.setTimeout(finish, 6000);
    return () => window.clearTimeout(cap);
  }, []);

  const onReveal = useCallback(() => {
    setRevealed(true);
    // Sections mounted behind the curtain; re-measure before anything scrolls.
    requestAnimationFrame(() => ScrollTrigger.refresh());
    // The charts are three sections down — warm them once the intro is idle.
    afterIdle(() => {
      void import("./components/HexRadar");
    });
  }, []);

  useEffect(() => {
    // Lenis is used ONLY as the smooth scroll engine for programmatic scrollTo.
    // All native input (wheel / touch) is routed to a detached element so Lenis
    // never produces free/continuous scrolling — we drive it section by section.
    const inputSink = document.createElement("div");
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelEventsTarget: inputSink,
      eventsTarget: inputSink,
    } as any);
    (window as any).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";

    let cooldown = false;
    let currentIdx = 0;
    (window as any).__currentSnapIdx = 0;

    const getSnaps = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap]"),
      );

    const syncActiveSection = () => {
      getSnaps().forEach((section, idx) => { section.inert = idx !== currentIdx; });
    };
    syncActiveSection();
    // Lazy sections replace their fallbacks after this effect has started.
    const sectionObserver = new MutationObserver(syncActiveSection);
    const page = document.getElementById("root")?.firstElementChild;
    if (page) sectionObserver.observe(page, { childList: true });

    // A section can register itself as consuming vertical intent (the Projects
    // carousel turns it into horizontal movement) until it reaches its edge.
    const tryHorizontal = (dir: number) => {
      const h = (window as any).__horizontalNav;
      if (!h) return false;
      const snaps = getSnaps();
      if (snaps[currentIdx]?.id !== h.id) return false;
      if (!h.step(dir)) return false;
      cooldown = true;
      accum = 0;
      window.setTimeout(() => { cooldown = false; accum = 0; }, 950);
      return true;
    };

    const snapTo = (idx: number) => {
      const snaps = getSnaps();
      if (idx < 0 || idx >= snaps.length) return;
      const focusWasInSection = snaps[currentIdx]?.contains(document.activeElement);
      currentIdx = idx;
      syncActiveSection();
      if (focusWasInSection) {
        snaps[idx].tabIndex = -1;
        snaps[idx].focus({ preventScroll: true });
      }
      (window as any).__currentSnapIdx = idx;
      // The phone section rail listens for this to track where you are.
      window.dispatchEvent(new CustomEvent("snapchange", { detail: idx }));
      cooldown = true;
      accum = 0;
      lenis.scrollTo(snaps[idx].offsetTop, {
        duration: 0.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        lock: true,
        force: true,
      });
      window.setTimeout(() => {
        cooldown = false;
        accum = 0;
      }, 1000);
    };
    (window as any).__snapTo = snapTo;

    // Wheel: accumulate delta so a single trackpad flick = exactly one section.
    let accum = 0;
    let decayTimer = 0;
    const THRESHOLD = 40;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || canScrollWithin(e.target, e.deltaY)) return;
      e.preventDefault();
      if (cooldown) return;

      accum += e.deltaY;
      window.clearTimeout(decayTimer);
      decayTimer = window.setTimeout(() => {
        accum = 0;
      }, 160);

      if (Math.abs(accum) >= THRESHOLD) {
        const dir = accum > 0 ? 1 : -1;
        if (tryHorizontal(dir)) return;
        snapTo(currentIdx + dir);
      }
    };

    // Touch: one swipe = one section.
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (canScrollWithin(e.target, dy)) return;
      e.preventDefault();
      if (cooldown) return;
      if (Math.abs(dy) > 50) {
        const dir = dy > 0 ? 1 : -1;
        if (tryHorizontal(dir)) return;
        snapTo(currentIdx + dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isInteractiveTarget(e.target)) return;
      const map: Record<string, number> = {
        ArrowDown: 1,
        PageDown: 1,
        " ": e.shiftKey ? -1 : 1,
        ArrowUp: -1,
        PageUp: -1,
      };
      if (e.key === "Home") {
        e.preventDefault();
        snapTo(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        snapTo(getSnaps().length - 1);
        return;
      }
      const dir = map[e.key];
      if (dir === undefined) return;
      if (canScrollWithin(e.target, dir)) return;
      e.preventDefault();
      if (cooldown) return;
      if (tryHorizontal(dir)) return;
      snapTo(currentIdx + dir);
    };

    // Keep the section aligned when the viewport changes size.
    let resizeTimer = 0;
    let nativeScrollTimer = 0;
    const onNativeScroll = () => {
      window.clearTimeout(nativeScrollTimer);
      nativeScrollTimer = window.setTimeout(() => {
        if (cooldown) return;
        const snaps = getSnaps();
        const nearest = snaps.reduce((best, section, idx) =>
          Math.abs(section.offsetTop - window.scrollY) < Math.abs(snaps[best].offsetTop - window.scrollY) ? idx : best, 0);
        if (nearest === currentIdx || !snaps.length) return;
        currentIdx = nearest;
        (window as any).__currentSnapIdx = nearest;
        syncActiveSection();
        window.dispatchEvent(new CustomEvent("snapchange", { detail: nearest }));
      }, 160);
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const snaps = getSnaps();
        if (snaps[currentIdx]) {
          lenis.scrollTo(snaps[currentIdx].offsetTop, {
            immediate: true,
            force: true,
          });
        }
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("wheel", onWheel, {
      passive: false,
    });
    window.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onNativeScroll);
      window.clearTimeout(decayTimer);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(nativeScrollTimer);
      window.clearTimeout(refreshTimer);
      sectionObserver.disconnect();
      getSnaps().forEach((section) => { section.inert = false; });
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as any).__lenis;
      delete (window as any).__snapTo;
      delete (window as any).__currentSnapIdx;
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <Preloader ready={bootReady} onReveal={onReveal} />
      <Cursor />
      <Navbar start={revealed} />
      {revealed && <SectionRail />}
      <Hero start={revealed} />
      <Suspense fallback={<SnapFallback />}>
        <About />
      </Suspense>
      <Suspense fallback={<SnapFallback />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SnapFallback />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SnapFallback dark />}>
        <Footer />
      </Suspense>
    </div>
  );
}
