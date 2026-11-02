import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { useIsMobile } from "./useMediaQuery";
import {
  Customized,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export type HexItem = { label: string; value: number };

type Props = {
  data: HexItem[];
  /** Runs the 0 -> value loading animation when it flips to true. */
  start?: boolean;
  delay?: number;
};

const INK = "var(--site-ink)";
const LINE = "var(--site-line)";
const SURFACE = "var(--site-surface)";
// Kept in sync with the site scale so the chart labels read like the rest of the UI.
// Shared body/detail sizes keep chart annotations within the reading hierarchy.
const LABEL_SIZE = "var(--text-body)";
const VALUE_SIZE = "var(--text-detail)";

/** Hexagonal (6-axis) radar chart matching the Figma stats design. */
export function HexRadar({ data, start = true, delay = 0 }: Props) {
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  // A phone gives the hexagon roughly a third of the drawing area it gets on
  // desktop, so the label gutters and type scale down with it.
  const mobile = useIsMobile();

  useEffect(() => {
    if (!start) return;
    // Users who ask for less motion get the final values right away.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    const o = { p: 0 };
    const tween = gsap.to(o, {
      p: 1,
      duration: 1.4,
      delay,
      ease: "power2.out",
      onUpdate: () => setProgress(o.p),
    });
    return () => { tween.kill(); };
  }, [start, delay]);

  const chartData = data.map((d, i) => ({
    index: i,
    label: d.label,
    target: d.value,
    value: d.value * progress,
  }));

  // These scores describe professional emphasis, not a proficiency assessment.
  const summary = "Professional focus. " + data.map((d) => `${d.label}: ${d.value} percent emphasis`).join(", ");

  return (
    <div
      className="h-full w-full"
      role="img"
      aria-label={summary}
      style={{
        "--hex-label": mobile ? "var(--text-detail)" : LABEL_SIZE,
        "--hex-value": VALUE_SIZE,
      } as CSSProperties}
    >
    <ResponsiveContainer width="100%" height="100%" onResize={(width) => setChartWidth(width)}>
      <RadarChart
        data={chartData}
        outerRadius={mobile ? "64%" : "72%"}
        margin={mobile ? { top: 26, right: 40, bottom: 32, left: 40 } : { top: 44, right: 68, bottom: 52, left: 68 }}
        onMouseLeave={() => setHover(null)}
      >
        {/* Opaque hexagon behind the grid so the page column lines don't show through */}
        <Customized key="hex-fill" component={HexBackground as any} />
        <PolarGrid key="grid" gridType="polygon" stroke={LINE} strokeWidth={0.75} radialLines />
        <PolarAngleAxis
          key="angle-axis"
          dataKey="label"
          tick={(props: any) => (
            <AxisTick {...props} data={chartData} hover={hover} onHover={setHover} compact={mobile} chartWidth={chartWidth} />
          )}
        />
        <PolarRadiusAxis key="radius-axis" domain={[0, 100]} tick={false} axisLine={false} tickLine={false} />
        <Radar
          key="radar"
          dataKey="value"
          stroke={INK}
          strokeWidth={1.5}
          fill={INK}
          fillOpacity={0.08}
          isAnimationActive={false}
          dot={({ key, ...props }: any) => (
            <ValueDot key={key} {...props} hover={hover} onHover={setHover} />
          )}
        />
      </RadarChart>
    </ResponsiveContainer>
    </div>
  );
}

/** Two words max per line, so long labels never collide at the bigger size. */
function wrapLabel(label: string, compact = false): string[] {
  const words = label.split(" ");
  if (words.length < 2 || label.length <= (compact ? 10 : 12)) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

/** Filled hexagon covering the full grid area. */
function HexBackground(props: any) {
  const axis = props?.angleAxisMap?.[0];
  if (!axis) return null;
  const { cx, cy, radius } = axis;
  const points = Array.from({ length: 6 }, (_, i) => {
    const a = ((90 - i * 60) * Math.PI) / 180;
    return `${cx + Math.cos(a) * radius},${cy - Math.sin(a) * radius}`;
  }).join(" ");
  return <polygon points={points} fill={SURFACE} stroke="none" />;
}

/** Dot sitting on every value vertex; hovering it highlights the label. */
function ValueDot({ cx, cy, index, hover, onHover }: any) {
  const active = hover === index;
  return (
    <g onMouseEnter={() => onHover(index)} style={{ cursor: "none" }}>
      {/* invisible, larger hit area */}
      <circle cx={cx} cy={cy} r={20} fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r={active ? 7 : 5}
        fill={INK}
        style={{ transition: "r 200ms cubic-bezier(0.22,1,0.36,1)" }}
      />
    </g>
  );
}

function AxisTick({ x, y, payload, textAnchor, data, hover, onHover, compact, chartWidth }: any) {
  const labelRef = useRef<SVGTextElement>(null);
  const [offset, setOffset] = useState(0);
  const item = data.find((d: any) => d.label === payload.value);
  const active = hover === item?.index;
  const anchor = (textAnchor ?? "middle") as "inherit" | "end" | "start" | "middle";
  // Push the label outwards along its own axis (0° = right, 90° = top).
  const angle = ((payload.coordinate ?? 90) * Math.PI) / 180;
  const sin = Math.sin(angle);
  const push = compact ? 9 : 14;
  const ox = Math.cos(angle) * push;
  const oy = -sin * push + (sin > 0.5 ? (compact ? -9 : -14) : sin < -0.5 ? (compact ? 16 : 24) : (compact ? 4 : 6));

  const rows = wrapLabel(String(payload.value), compact);
  useLayoutEffect(() => {
    if (!chartWidth || !labelRef.current) return;
    let disposed = false;
    const measure = () => {
      if (disposed || !labelRef.current) return;
      const width = Math.max(...Array.from(labelRef.current.querySelectorAll("tspan"), (span) => span.getComputedTextLength()));
      const left = x + ox - (anchor === "end" ? width : anchor === "middle" ? width / 2 : 0);
      const right = left + width;
      setOffset(Math.max(4 - left, Math.min(0, chartWidth - 4 - right)));
    };
    measure();
    void document.fonts.ready.then(measure);
    return () => { disposed = true; };
  }, [chartWidth, x, ox, anchor, payload.value, compact]);
  // A two-line label on the top axis would otherwise put its value on the
  // radar vertex. Place that value above the label instead.
  const valueY = sin > 0.75
    ? -22
    : rows.length > 1 ? (compact ? 40 : 48) : compact ? 22 : 28;

  return (
    <g
      transform={`translate(${x + ox + offset}, ${y + oy})`}
      onMouseEnter={() => onHover(item?.index ?? null)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(item?.index ?? null)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      aria-label={`${payload.value}: ${item?.target ?? 0} percent professional focus`}
    >
      <text
        ref={labelRef}
        textAnchor={anchor}
        fill={INK}
        className="font-sans"
        style={{
          fontSize: "var(--hex-label)",
          fontWeight: 400,
          // Hover/focus underlines the stat instead of changing its weight,
          // so the label never shifts width.
          textDecoration: active ? "underline" : "none",
          textUnderlineOffset: "0.22em",
        }}
      >
        {rows.map((r, i) => (
          <tspan key={r} x={0} dy={i === 0 ? 0 : "1.15em"}>
            {r}
          </tspan>
        ))}
      </text>
      <text
        y={valueY}
        textAnchor={anchor}
        className="font-sans"
        fill={active ? INK : "var(--site-muted)"}
        style={{ fontSize: "var(--hex-value)", fontWeight: 600 }}
      >
        {`${Math.round(item?.value ?? 0)}%`}
      </text>
    </g>
  );
}
