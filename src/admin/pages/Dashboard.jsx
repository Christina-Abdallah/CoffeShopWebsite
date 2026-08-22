import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Coffee,
  Calendar,
  TrendingUp,
  Plus,
  ChevronRight,
  Bell,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getDashboard } from "../api";

function KpiCard({ title, value, footer, icon: Icon, color = "forest" }) {
  const colorMap = {
    forest: "bg-forest/10 text-forest",
    clay: "bg-clay-100 text-clay",
    sage: "bg-sage-light text-sage",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-soft">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-ink-light">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-display font-semibold text-ink mb-1">{value}</p>
      {footer && <p className="text-xs text-ink-light">{footer}</p>}
    </div>
  );
}

function QuickAction({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 border border-cream-200 hover:border-clay/40 transition text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-clay-100 text-clay flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-light">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-ink-light" />
    </button>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard" subtitle="Loading..."><div className="text-ink-light">Loading...</div></AdminLayout>;
  if (error) return <AdminLayout title="Dashboard"><div className="text-rose">{error}</div></AdminLayout>;

  const { kpis, recentMessages } = data || {};

  return (
    <AdminLayout
      title="Café Overview"
      subtitle="Here's how Brew & Co. is performing today."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Active Reservations"
          value={`${kpis?.activeReservations ?? 0} tables`}
          footer="today"
          icon={Calendar}
          color="forest"
        />
        <KpiCard
          title="Popular Item"
          value={kpis?.popularItem || "N/A"}
          footer="top seller"
          icon={Coffee}
          color="clay"
        />
        <KpiCard
          title="Menu Items"
          value={kpis?.menuCount ?? 0}
          footer="total items"
          icon={LayoutDashboard}
          color="sage"
        />
        <KpiCard
          title="Unread Messages"
          value={kpis?.unreadMessages ?? 0}
          footer="customer messages"
          icon={Bell}
          color="forest"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-soft">
            <h2 className="text-lg font-display font-semibold text-ink mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <QuickAction
                icon={Plus}
                title="Add Menu Item"
                subtitle="Create a new beverage or pastry"
              />
              <QuickAction
                icon={TrendingUp}
                title="View Live Reports"
                subtitle="Check current cashier logs"
              />
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
            <div className="p-5 border-b border-cream-200 flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-ink">Messages</h2>
              <span className="text-sm text-ink-light">Recent unread</span>
            </div>
            <div className="divide-y divide-cream-200">
              {recentMessages?.length > 0 ? (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="p-4 flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-clay" />
                    <div className="flex-1">
                      <p className="font-medium text-ink">{msg.fullName}</p>
                      <p className="text-sm text-ink-light line-clamp-1">{msg.message}</p>
                    </div>
                    <span className="text-xs text-ink-light whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-ink-light">No new messages</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
