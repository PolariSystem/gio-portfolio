import type { AnchorHTMLAttributes } from "react";

/** Native link with the same four-corner interaction as ActionButton. */
export function ActionLink({ children, className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className={`action-link font-cond uppercase ${className}`}>
      {(["top", "bottom"] as const).flatMap((v) => (["left", "right"] as const).map((h) => (
        <span key={`${v}-${h}`} aria-hidden className="action-link-corner" style={{
          [v]: 0, [h]: 0,
          borderWidth: `${v === "top" ? 2 : 0}px ${h === "right" ? 2 : 0}px ${v === "bottom" ? 2 : 0}px ${h === "left" ? 2 : 0}px`,
        }} />
      )))}
      <span>{children}</span>
      <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </a>
  );
}
