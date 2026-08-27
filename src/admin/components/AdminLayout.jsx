import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  Calendar,
  UsersRound,
  LogOut,
  Menu,
  Search,
  Bell,
} from "lucide-react";
import { useAdmin } from "../useAdmin";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/menu", label: "Menu Management", icon: Coffee },
  { to: "/admin/reservations", label: "Reservations", icon: Calendar },
  { to: "/admin/staff", label: "Staff", icon: UsersRound },
];

function SidebarFooter({ onClose }) {
  const { user, logout } = useAdmin();

  return (
    <div className="group relative w-full rounded-[8px] transition-colors hover:bg-[#264132]">
      <div className="h-px w-full bg-[#f1ebe4]/15 mb-[12px]" />
      <NavLink
        to="/admin/settings"
        onClick={onClose}
        className="flex items-center gap-[10px] w-full px-2 py-1.5"
      >
        <div className="relative shrink-0 size-[36px] rounded-full bg-[#b55b3e]/20 flex items-center justify-center overflow-hidden">
          <span className="text-[#b55b3e] text-[13px] font-semibold">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "AD"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-white truncate">
            {user?.name || "Arthur Pendelton"}
          </p>
          <p className="text-[11px] text-[#f1ebe4]/70 truncate">
            {user?.role || "Store Manager"}
          </p>
        </div>
      </NavLink>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          logout();
        }}
        title="Log out"
        className="absolute right-2 top-1/2 translate-y-[4px] p-1.5 rounded-full text-[#f1ebe4]/0 group-hover:text-[#f1ebe4]/70 hover:!text-white hover:bg-white/10 transition-all"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}

function Sidebar({ onClose }) {
  return (
    <aside
      className="w-[260px] h-screen bg-[#152e20] flex flex-col justify-between p-[24px] sticky top-0"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="flex flex-col gap-[32px] w-full">
        <div className="flex items-center gap-[10px] w-full">
          <div className="bg-[#b55b3e] rounded-full size-[36px] flex items-center justify-center shrink-0">
            <Coffee size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[18px] font-black text-white leading-tight font-display">
              Brew & Co.
            </h1>
            <p className="text-[11px] font-semibold uppercase text-[#f1ebe4]/60 tracking-wide">
              Admin Console
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-[6px] w-full">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#b55b3e] text-white"
                    : "text-[#f1ebe4]/80 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <SidebarFooter onClose={onClose} />
    </aside>
  );
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  search,
  onSearchChange,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const placeholder = pathname.includes("menu")
    ? "Search menu items, tags..."
    : "Search orders, tables...";
  return (
    <div className="h-screen bg-[#f7f4f0] flex overflow-hidden">
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

      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-[#f7f4f0]/95 backdrop-blur-sm border-b border-[#e9e2d8] px-6 py-4">
          <div className="flex items-center justify-between gap-[16px]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[#7c6c67] hover:text-[#2e221d]"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl font-display font-semibold text-[#2e221d] truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-[#7c6c67] truncate">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-[12px] shrink-0">
              {/* Real search input */}
              <div className="hidden sm:block relative">
                <Search
                  size={14}
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7c6c67]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder={placeholder}
                  className="w-[220px] h-[34px] pl-[34px] pr-[14px] rounded-full bg-white border border-[#e9e2d8] text-[13px] text-[#2e221d] placeholder:text-[#7c6c67] outline-none focus:border-[#b55b3e] transition"
                />
              </div>

              {/* Notifications */}
              <button
                type="button"
                title="Notifications"
                className="relative shrink-0 size-[36px] rounded-full border border-[#e9e2d8] bg-white flex items-center justify-center text-[#2e221d] hover:border-[#b55b3e]/50 transition"
              >
                <Bell size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}