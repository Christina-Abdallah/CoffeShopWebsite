import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Coffee, Menu as MenuIcon, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/reservation", label: "Reservation" },
  { to: "/contact", label: "Contact" },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="relative flex h-8 w-16 items-center rounded-full border border-ink/10 bg-cream-soft px-1 dark:border-cream/20 dark:bg-forest-light transition-colors"
    >
      <Sun size={13} className="absolute left-1.5 text-clay" />
      <Moon size={13} className="absolute right-1.5 text-cream/70" />
      <span
        className={`z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform duration-300 dark:bg-forest-deep ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={13} className="text-cream" /> : <Sun size={13} className="text-clay" />}
      </span>
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-clay ${
      isActive ? "text-clay" : "text-ink/80 dark:text-cream-soft/80"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/90 backdrop-blur dark:border-cream/10 dark:bg-forest-deep/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Coffee size={22} className="text-forest dark:text-clay-light" />
          Brew &amp; Co.
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-ink/5 bg-cream px-5 py-5 dark:border-cream/10 dark:bg-forest-deep md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={linkClass}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </div>
      )}
    </header>
  );
}