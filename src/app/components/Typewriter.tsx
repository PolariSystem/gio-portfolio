import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  speed?: number;
  as?: keyof JSX.IntrinsicElements;
  startOnView?: boolean;
  showCaret?: boolean;
};

export function Typewriter({ text, className, style, delay = 0, speed = 35, as: Tag = "span", startOnView = false, showCaret = true }: Props) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!startOnView || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } },
      { threshold: 0.25 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const t = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setCount(i);
        if (i >= text.length) clearInterval(id);
      }, speed);
    }, delay);
    return () => clearTimeout(t);
  }, [started, text, speed, delay]);

  const done = count >= text.length;
  return (
    <Tag ref={ref as any} className={className} style={style}>
      {text.slice(0, count)}
      {showCaret && !done && started && (
        <span className="inline-block w-[0.08em] align-baseline" style={{ background: "currentColor", height: "0.9em", marginLeft: 2, animation: "blink 0.7s steps(1) infinite" }} />
      )}
    </Tag>
  );
}
