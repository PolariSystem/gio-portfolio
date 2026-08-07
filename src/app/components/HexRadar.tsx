import { useEffect, useState } from "react";
import { gsap } from "gsap";
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

const INK = "#121316";
const LINE = "#e7e7e8";
const SURFACE = "#fafafa";
// Kept in sync with the site scale so the chart labels read like the rest of the UI.
// Min ~20px on desktop widths, still legible (and never below 15px) on small screens.
const LABEL_SIZE = "clamp(15px, calc(0.9vw + 7px), 26px)";
const VALUE_SIZE = "clamp(13px, calc(0.8vw + 6px), 23px)";

/** Hexagonal (6-axis) radar chart matching the Figma stats design. */
export function HexRadar({ data, start = true, delay = 0 }: Props) {
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

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

  // Screen-reader alternative: the same figures as plain text.
  const summary = data.map((d) => `${d.label}: ${d.value} percent`).join(", ");

  return (
    <div className="h-full w-full" role="img" aria-label={summary}>
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        data={chartData}
        outerRadius="72%"
        margin={{ top: 44, right: 68, bottom: 52, left: 68 }}
        onMouseLeave={() => setHover(null)}
      >
        {/* Opaque hexagon behind the grid so the page column lines don't show through */}
        <Customized key="hex-fill" component={HexBackground as any} />
        <PolarGrid key="grid" gridType="polygon" stroke={LINE} strokeWidth={0.75} radialLines />
        <PolarAngleAxis
          key="angle-axis"
          dataKey="label"
          tick={(props: any) => (
            <AxisTick {...props} data={chartData} hover={hover} onHover={setHover} />
          )}
        />
        <PolarRadiusAxis key="radius-axis" domain={[0, 100]} tick={false} axisLine={false} tickLine={false} />
        <Radar
          key="radar"
          dataKey="value"
          stroke={INK}
          strokeWidth={1.5}
          fill={INK}
          fillOpacity={0.04}
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
function wrapLabel(label: string): string[] {
  const words = label.split(" ");
  if (words.length < 2 || label.length <= 14) return [label];
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

function AxisTick({ x, y, payload, textAnchor, data, hover, onHover }: any) {
  const item = data.find((d: any) => d.label === payload.value);
  const active = hover === item?.index;
  const anchor: string = textAnchor ?? "middle";
  // Push the label outwards along its own axis (0° = right, 90° = top).
  const angle = ((payload.coordinate ?? 90) * Math.PI) / 180;
  const sin = Math.sin(angle);
  const ox = Math.cos(angle) * 14;
  const oy = -sin * 14 + (sin > 0.5 ? -14 : sin < -0.5 ? 24 : 6);

  const rows = wrapLabel(String(payload.value));

  return (
    <g
      transform={`translate(${x + ox}, ${y + oy})`}
      onMouseEnter={() => onHover(item?.index ?? null)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(item?.index ?? null)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      aria-label={`${payload.value}: ${item?.target ?? 0} percent`}
    >
      <text
        textAnchor={anchor}
        fill={INK}
        className="font-sans"
        style={{
          fontSize: LABEL_SIZE,
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
        y={rows.length > 1 ? 50 : 26}
        textAnchor={anchor}
        className="font-sans"
        fill={active ? INK : "rgba(18,19,22,0.55)"}
        style={{ fontSize: VALUE_SIZE, fontWeight: 400 }}
      >
        {`${Math.round(item?.value ?? 0)}%`}
      </text>
    </g>
  );
}
