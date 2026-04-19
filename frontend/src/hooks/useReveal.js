import { useEffect } from "react";
import { useContent } from "@/context/ContentContext";

/**
 * Adds the CSS class `.in` to any element with `.reveal` as soon as it scrolls
 * into the viewport, unlocking the fade-in-up animation defined in index.css.
 *
 * - Re-runs whenever the CMS `loading` state flips, so sections that render
 *   AFTER `/api/cms` resolves still get faded in.
 * - Any `.reveal` element already inside the viewport at mount time is shown
 *   immediately (IntersectionObserver only fires on *changes* after the
 *   observer is registered).
 *
 * Usage: call `useReveal()` once at the top of any page component that uses
 * the `.reveal` class. That's it — no other wiring needed.
 */
export default function useReveal() {
  const { loading } = useContent();

  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => {
      io.observe(el);
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("in");
      }
    });

    return () => io.disconnect();
  }, [loading]);
}
