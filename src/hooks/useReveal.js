import { useEffect, useRef } from "react";
 
/**
 * Attaches an IntersectionObserver to the returned ref.
 * Adds "is-visible" the first time the element enters the viewport,
 * pairing with the .reveal / .is-visible CSS in index.css.
 */
export default function useReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
 
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
 
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, options);
 
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return ref;
}