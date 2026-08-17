import useReveal from "../hooks/useReveal";

/**
 * Wraps children in a div that fades/slides up into view on scroll.
 * `delay` (ms) lets sibling elements stagger.
 */
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}