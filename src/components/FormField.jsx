import { useRef } from "react";

export default function FormField({
  label,
  name,
  type = "text",
  as = "input",
  value,
  onChange,
  error,
  placeholder,
  min,
  icon,
  children,
}) {
  const inputRef = useRef(null);
  const isPicker = as === "input" && (type === "date" || type === "time");

  const baseClass = `w-full rounded-lg border bg-cream-soft px-4 py-3 text-sm outline-none transition-colors dark:bg-forest-light dark:text-cream ${
    icon ? "pr-10" : ""
  } ${
    error ? "border-clay" : "border-ink/10 dark:border-cream/15 focus:border-forest dark:focus:border-clay-light"
  }`;

  const Tag = as;

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
      } catch {
        // showPicker can throw if already open or unsupported in this context — safe to ignore
      }
    }
  };

  return (
    <div
      className={`w-full ${isPicker ? "cursor-pointer" : ""}`}
      onClick={isPicker ? openPicker : undefined}
    >
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-stone-900 dark:text-cream"
      >
        {label}
      </label>
      <div className="relative w-full">
        {as === "select" ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${baseClass} block w-full min-w-0`}
          >
            {children}
          </select>
        ) : (
          <Tag
            ref={inputRef}
            id={name}
            name={name}
            type={as === "input" ? type : undefined}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            rows={as === "textarea" ? 4 : undefined}
            className={`${baseClass} block w-full min-w-0 ${isPicker ? "cursor-pointer appearance-none" : ""}`}
            style={isPicker ? { width: "100%" } : undefined}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        )}
        {icon && (
          <span
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink/40 dark:text-cream-soft/40 ${
              as === "select" ? "right-8" : "right-3.5"
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs font-medium text-clay-dark dark:text-clay-light">
          {error}
        </p>
      )}
    </div>
  );
}