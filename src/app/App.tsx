import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cursor } from "./components/Cursor";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Services } from "./components/sections/Services";
import { Projects } from "./components/sections/Projects";
import { Presentations } from "./components/sections/Presentations";
import { Footer } from "./components/sections/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
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
      currentIdx = idx;
      (window as any).__currentSnapIdx = idx;
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
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (cooldown) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) > 50) {
        const dir = dy > 0 ? 1 : -1;
        if (tryHorizontal(dir)) return;
        snapTo(currentIdx + dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, number> = {
        ArrowDown: 1,
        PageDown: 1,
        " ": 1,
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
      e.preventDefault();
      if (cooldown) return;
      if (tryHorizontal(dir)) return;
      snapTo(currentIdx + dir);
    };

    // Keep the section aligned when the viewport changes size.
    let resizeTimer = 0;
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

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(decayTimer);
      window.clearTimeout(resizeTimer);
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
      <Cursor />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Presentations />
      <Footer />
    </div>
  );
}