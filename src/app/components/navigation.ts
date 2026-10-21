/** Let native controls keep their keyboard behavior. */
export function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(
    "a, button, input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='button'], [role='tab'], [role='slider']",
  ));
}

/** Consume gestures inside an overflowing panel before advancing sections. */
export function canScrollWithin(target: EventTarget | null, direction: number) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el instanceof HTMLElement && /auto|scroll/.test(getComputedStyle(el).overflowY)) {
      const max = el.scrollHeight - el.clientHeight;
      if (max > 1 && (direction > 0 ? el.scrollTop < max - 1 : el.scrollTop > 1)) return true;
    }
    el = el.parentElement;
  }
  return false;
}
