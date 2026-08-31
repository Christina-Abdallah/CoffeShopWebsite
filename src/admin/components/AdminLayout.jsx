import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  Calendar,
  Clock,
  AlertTriangle,
  UsersRound,
  LogOut,
  Search,
  Bell,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import { useAdmin } from "../useAdmin";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/menu", label: "Menu", icon: Coffee },
  { to: "/admin/reservations", label: "Booking", icon: Calendar },
  { to: "/admin/staff", label: "Staff", icon: UsersRound },
];

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
const PRIORITY_COLOR = {
  high: "#b55b3e",
  medium: "#c99a56",
  low: "#7c6c67",
};

const NOTIFICATION_ICON = {
  reservation: Calendar,
  stock: AlertTriangle,
  table: Clock,
};

const NOTIFICATIONS_PAGE_SIZE = 6;

function initials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) || "AD"
  );
}

function Avatar({ user, size = 36 }) {
  return (
    <div
      className="relative shrink-0 rounded-full bg-[#b55b3e]/20 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user?.name || "Profile"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="text-[#b55b3e] font-semibold"
          style={{ fontSize: size * 0.36 }}
        >
          {initials(user?.name)}
        </span>
      )}
    </div>
  );
}

function SidebarFooter() {
  const { user, logout } = useAdmin();

  return (
    <div className="group relative w-full rounded-[8px] transition-colors hover:bg-[#264132]">
      <div className="h-px w-full bg-[#f1ebe4]/15 mb-[12px]" />

      <NavLink
        to="/admin/settings"
        className="flex items-center gap-[10px] w-full px-2 py-1.5"
      >
        <Avatar user={user} />

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
        className="absolute right-2 top-1/2 translate-y-[4px] p-1.5 rounded-full text-[#f1ebe4]/0 group-hover:text-[#f1ebe4]/70 hover:!text-white hover:bg-white/10 transition-all"
        aria-label="Logout"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}

function Sidebar() {
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

      <SidebarFooter />
    </aside>
  );
}

function NotificationsView({
  notifications,
  onResolve,
  onClose,
}) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...notifications].sort(
    (a, b) =>
      (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3)
  );

  const visible = showAll
    ? sorted
    : sorted.slice(0, NOTIFICATIONS_PAGE_SIZE);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#f7f4f0]/95 backdrop-blur-sm border-b border-[#e9e2d8] px-6 py-4">
        <div className="flex items-center justify-between gap-[16px]">
          <h1 className="text-xl font-display font-semibold text-[#2e221d]">
            Notifications
          </h1>

          <button
            onClick={onClose}
            className="shrink-0 size-[36px] rounded-full border border-[#e9e2d8] bg-white flex items-center justify-center text-[#2e221d]"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="overflow-hidden rounded-[16px] border border-[#e9e2d8] bg-white shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)]">
          <div className="divide-y divide-[#e9e2d8] px-[16px] lg:px-[24px]">
            {visible.length > 0 ? (
              visible.map((n) => {
                const Icon =
                  NOTIFICATION_ICON[n.type] || AlertTriangle;

                const color =
                  PRIORITY_COLOR[n.priority] || "#7c6c67";

                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-[12px] py-[16px] border-l-[3px] pl-[10px] -ml-[3px]"
                    style={{
                      borderColor:
                        n.priority === "high"
                          ? color
                          : "transparent",
                    }}
                  >
                    <div
                      className="mt-[2px] flex size-[30px] shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${color}1a`,
                      }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-[8px]">
                        <p className="text-[14px] font-semibold text-[#2e221d] truncate">
                          {n.label}
                        </p>

                        <span className="text-[12px] text-[#7c6c67] whitespace-nowrap shrink-0">
                          {n.ago}
                        </span>
                      </div>

                      <p className="text-[13px] text-[#7c6c67] truncate">
                        {n.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-[4px] pt-[2px]">
                      <button
                        onClick={() => onResolve(n.id, "seen")}
                        aria-label="Mark as seen"
                        title="Mark as seen"
                        className="flex size-[24px] items-center justify-center rounded-full text-[#1a6f54] hover:bg-[#1a6f54]/10"
                      >
                        <Check size={14} />
                      </button>

                      <button
                        onClick={() =>
                          onResolve(n.id, "dismissed")
                        }
                        aria-label="Dismiss"
                        title="Dismiss"
                        className="flex size-[24px] items-center justify-center rounded-full text-[#7c6c67] hover:bg-[#7c6c67]/10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-[32px] text-center text-[#7c6c67]">
                No notifications
              </div>
            )}
          </div>

          {sorted.length > NOTIFICATIONS_PAGE_SIZE && (
            <div className="border-t border-[#e9e2d8] py-[14px] text-center">
              <button
                onClick={() => setShowAll((value) => !value)}
                className="inline-flex items-center gap-[6px] text-[12px] font-bold uppercase tracking-wide text-[#b55b3e]"
              >
                {showAll ? "Show less" : "Read more"}
                <span aria-hidden>→</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  search = "",
  onSearchChange,
  notifications = [],
  onResolveNotification,
  onFilterClick,
  extraAction,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { user } = useAdmin();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isDashboard = pathname === "/admin";
  const isSettings = pathname === "/admin/settings";

  const placeholder = pathname.includes("menu")
    ? "Search menu items..."
    : pathname.includes("staff")
      ? "Search staff..."
      : pathname.includes("reservations")
        ? "Search reservations..."
        : "Search...";

  const showNotificationsView =
    isDashboard && notifOpen;

  function handleMobileSearchClick() {
    if (onFilterClick) {
      onFilterClick();
      return;
    }

    setMobileSearchOpen((value) => !value);
  }

  return (
    <div className="h-screen bg-[#f7f4f0] flex overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 min-w-0 h-screen overflow-y-auto pb-[80px] lg:pb-0">
        {showNotificationsView ? (
          <NotificationsView
            notifications={notifications}
            onResolve={(id, status) =>
              onResolveNotification?.(id, status)
            }
            onClose={() => setNotifOpen(false)}
          />
        ) : (
          <>
            <header className="sticky top-0 z-30 bg-[#f7f4f0]/95 backdrop-blur-sm border-b border-[#e9e2d8] px-6 py-4">
              <div className="flex items-center justify-between gap-[16px]">
                <div className="flex items-center gap-3 min-w-0">
                  {isDashboard && (
                    <NavLink
                      to="/admin/settings"
                      className="lg:hidden shrink-0"
                    >
                      <Avatar user={user} size={40} />
                    </NavLink>
                  )}

                  <div className="min-w-0">
                    <h1 className="text-xl font-display font-semibold text-[#2e221d] truncate">
                      {title}
                    </h1>

                    {subtitle && (
                      <p className="text-sm text-[#7c6c67] truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-[12px] shrink-0">
                  {/* Desktop search */}
                  <div className="hidden sm:block relative">
                    <Search
                      size={14}
                      className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7c6c67]"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        onSearchChange?.(e.target.value)
                      }
                      placeholder={placeholder}
                      className="w-[220px] h-[34px] pl-[34px] pr-[14px] rounded-full bg-white border border-[#e9e2d8] text-[13px] text-[#2e221d] outline-none focus:border-[#b55b3e] transition"
                    />
                  </div>

                  {/* Dashboard notifications */}
                  {isDashboard ? (
                    <button
                      onClick={() => setNotifOpen(true)}
                      className="relative shrink-0 size-[36px] rounded-full border border-[#e9e2d8] bg-white flex items-center justify-center text-[#2e221d]"
                      aria-label="Notifications"
                    >
                      <Bell size={16} />

                      {notifications.length > 0 && (
                        <span className="absolute -top-[2px] -right-[2px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#b53e3e] px-[3px] text-[10px] font-bold leading-none text-white">
                          {notifications.length > 9
                            ? "9+"
                            : notifications.length}
                        </span>
                      )}
                    </button>
                  ) : isSettings ? (
                    <button
                      onClick={() => navigate(-1)}
                      className="relative shrink-0 size-[36px] rounded-full border border-[#e9e2d8] bg-white flex items-center justify-center text-[#2e221d]"
                      aria-label="Back"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleMobileSearchClick}
                      className="relative shrink-0 size-[36px] rounded-full border border-[#e9e2d8] bg-white flex items-center justify-center text-[#2e221d]"
                      aria-label="Search"
                    >
                      <Search size={16} />
                    </button>
                  )}

                  {/* Page-specific action */}
                  {extraAction && (
                    <button
                      onClick={extraAction.onClick}
                      className="shrink-0 size-[36px] rounded-full bg-[#b55b3e] text-white flex items-center justify-center hover:opacity-90 transition"
                      aria-label={
                        extraAction.label || "Add"
                      }
                    >
                      <extraAction.icon size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile search */}
              {!isDashboard &&
                !isSettings &&
                mobileSearchOpen && (
                  <div className="sm:hidden mt-[12px] relative">
                    <Search
                      size={14}
                      className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#7c6c67]"
                    />

                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) =>
                        onSearchChange?.(e.target.value)
                      }
                      placeholder={placeholder}
                      className="w-full h-[38px] pl-[36px] pr-[14px] rounded-full bg-white border border-[#e9e2d8] text-[13px] text-[#2e221d] outline-none focus:border-[#b55b3e] transition"
                    />
                  </div>
                )}
            </header>

            <main className="p-6">{children}</main>
          </>
        )}
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-[#152e20] border-t border-white/10 flex items-center justify-around px-4 lg:hidden z-40">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            onClick={() => {
              setNotifOpen(false);
              setMobileSearchOpen(false);
            }}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive
                  ? "text-[#b55b3e]"
                  : "text-[#f1ebe4]/60"
              }`
            }
          >
            <Icon size={20} />

            <span className="text-[10px] font-medium uppercase tracking-wider">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}