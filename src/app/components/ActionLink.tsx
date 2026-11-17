import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "corners" | "outline" };

/** Native link sharing the button system's corner and filled-outline variants. */
export function ActionLink({ children, className = "", variant = "corners", ...props }: Props) {
  const outlined = variant === "outline";
  return (
    <a {...props} className={`action-link font-cond uppercase ${outlined ? "action-link--outline action-fill" : ""} ${className}`}>
      {!outlined && (["top", "bottom"] as const).flatMap((v) => (["left", "right"] as const).map((h) => (
        <span key={`${v}-${h}`} aria-hidden className="action-link-corner" style={{
          [v]: 0, [h]: 0,
          borderWidth: `${v === "top" ? 2 : 0}px ${h === "right" ? 2 : 0}px ${v === "bottom" ? 2 : 0}px ${h === "left" ? 2 : 0}px`,
        }} />
      )))}
      <span className="action-link-label">{children}</span>
      <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </a>
  );
}
