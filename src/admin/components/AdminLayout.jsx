import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  Calendar,
  UsersRound,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useAdmin } from "../useAdmin";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/menu", label: "Menu Management", icon: Coffee },
  { to: "/admin/reservations", label: "Reservations", icon: Calendar },
  { to: "/admin/staff", label: "Staff", icon: UsersRound },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar({ onClose }) {
  const { user, logout } = useAdmin();

  return (
    <aside className="w-64 h-screen bg-white border-r border-cream-200 flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center">
            <span className="text-cream font-display font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-ink">Brew & Co.</h1>
            <p className="text-xs text-ink-light">Admin Console</p>
          </div>
        </div>

        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-forest text-cream"
                    : "text-ink-light hover:bg-cream-100 hover:text-ink"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-cream-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-clay-100 flex items-center justify-center">
            <span className="text-clay text-sm font-semibold">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "AD"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-ink-light truncate">{user?.role || "Manager"}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-ink-light hover:text-rose transition"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children, title, subtitle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 text-ink-light hover:text-ink"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-display font-semibold text-ink">{title}</h1>
                {subtitle && <p className="text-sm text-ink-light">{subtitle}</p>}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-white rounded-full border border-cream-200 text-sm text-ink-light">
              <span>Search orders, tables...{pathname.includes("menu") ? " menu items..." : ""}</span>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
