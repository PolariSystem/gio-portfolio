import { useState, type ButtonHTMLAttributes, type CSSProperties } from "react";

type Tone = "light" | "dark";
type Size = "nav" | "cta";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** "light" = white ink on dark bg, "dark" = ink #121316 on light bg */
  tone?: Tone;
  size?: Size;
};

const SIZES: Record<Size, CSSProperties> = {
  nav: { padding: "10px 20px", fontSize: "1rem" },
  cta: { padding: "16px 32px", fontSize: "1rem" },
};

const EASE = "cubic-bezier(0.22,1,0.36,1)";
type Corner = {
  v: "top" | "bottom";
  h: "left" | "right";
};
const CORNERS: Corner[] = [
  { v: "top", h: "left" },
  { v: "top", h: "right" },
  { v: "bottom", h: "left" },
  { v: "bottom", h: "right" },
];

/**
 * Shared landing button.
 * Default: ghost (text only) — Hover: dashed corner lines draw in — Press: the
 * corners grow slightly and a faint tint fills the box to back them up.
 */
export function ActionButton({ tone = "light", size = "cta", style, children, ...rest }: Props) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const ink = tone === "light" ? "#fafafa" : "#121316";
  const tint = tone === "light" ? "255,255,255" : "18,19,22";
  const on = hover || press;

  return (
    <button
      {...rest}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHover(false); setPress(false); rest.onMouseLeave?.(e); }}
      onMouseDown={(e) => { setPress(true); rest.onMouseDown?.(e); }}
      onMouseUp={(e) => { setPress(false); rest.onMouseUp?.(e); }}
      onFocus={(e) => { setHover(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setPress(false); setHover(false); rest.onBlur?.(e); }}
      // Touch has no hover, so without these the signature corner draw would
      // never play on a phone.
      onTouchStart={(e) => { setHover(true); setPress(true); rest.onTouchStart?.(e); }}
      onTouchEnd={(e) => { setPress(false); setHover(false); rest.onTouchEnd?.(e); }}
      onTouchCancel={(e) => { setPress(false); setHover(false); rest.onTouchCancel?.(e); }}
      className={`font-cond relative uppercase ${rest.className ?? ""}`}
      style={{
        background: press ? `rgba(${tint},0.04)` : "transparent",
        border: "none",
        color: ink,
        letterSpacing: "0.02em",
        lineHeight: 1.04,
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: `background-color 320ms ${EASE}, transform 320ms ${EASE}`,
        transform: press ? "scale(0.98)" : "none",
        ...SIZES[size],
        ...style,
      }}
    >
      {CORNERS.map((c, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            [c.v]: 0,
            [c.h]: 0,
            // corners grow from 0 -> 28% of the box, a touch further on press
            width: on ? (press ? "24%" : "16%") : "0%",
            height: on ? (press ? "28%" : "24%") : "0%",
            borderStyle: "solid",
            borderColor: ink,
            borderWidth: [
              c.v === "top" ? 2 : 0,
              c.h === "right" ? 2 : 0,
              c.v === "bottom" ? 2 : 0,
              c.h === "left" ? 2 : 0,
            ].map((n) => `${n}px`).join(" "),
            opacity: on ? 1 : 0,
            transformOrigin: `${c.v} ${c.h}`,
            pointerEvents: "none",
            transition: `width 380ms ${EASE}, height 380ms ${EASE}, opacity 220ms ${EASE}`,
          }}
        />
      ))}
      <span style={{ position: "relative" }}>{children}</span>
    </button>
  );
}
