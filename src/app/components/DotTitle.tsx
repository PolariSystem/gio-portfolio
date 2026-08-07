import { useEffect, useState, type CSSProperties } from "react";
import { useFontsReady } from "./useFontsReady";

type Props = {
  /** Lines WITHOUT the trailing period — the dot is rendered as the caret. */
  lines: string[];
  start?: boolean;
  charMs?: number;
  lineBreakMs?: number;
  onDone?: () => void;
  /** Heading tag to render (defaults to h2). */
  as?: "h1" | "h2" | "h3";
  className?: string;
  style?: CSSProperties;
};

/**
 * Title where the final period is present from the first frame and "writes"
 * the copy linearly, line by line, then stays blinking at the end.
 */
export function DotTitle({
  lines,
  start = true,
  charMs = 45,
  lineBreakMs = 120,
  onDone,
  as: Tag = "h2",
  className,
  style,
}: Props) {
  const total = lines.reduce((n, l) => n + l.length, 0);
  const [count, setCount] = useState(0);
  const fontsReady = useFontsReady();

  useEffect(() => {
    if (!start || !fontsReady) return;
    let cancelled = false;
    (async () => {
      let n = 0;
      for (let i = 0; i < lines.length; i++) {
        for (let c = 0; c < lines[i].length; c++) {
          if (cancelled) return;
          n += 1;
          setCount(n);
          await new Promise((r) => setTimeout(r, charMs));
        }
        if (i < lines.length - 1) await new Promise((r) => setTimeout(r, lineBreakMs));
      }
      if (!cancelled) onDone?.();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, fontsReady]);

  let remaining = count;
  const typed = lines.map((l) => {
    const take = Math.max(0, Math.min(l.length, remaining));
    remaining -= take;
    return l.slice(0, take);
  });
  const done = count >= total;
  const dotLine = done
    ? lines.length - 1
    : Math.max(0, typed.findIndex((t, i) => t.length < lines[i].length));

  return (
    <Tag className={className} style={{ margin: 0, ...style }}>
      {lines.map((_, i) => (
        <span key={i} className="block" style={{ whiteSpace: "nowrap" }}>
          <span>{typed[i]}</span>
          {i === dotLine && (
            <span
              aria-hidden
              style={{ display: "inline-block", animation: done ? "blink 0.7s steps(1) infinite" : undefined }}
            >
              .
            </span>
          )}
          {typed[i].length === 0 && i !== dotLine && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
