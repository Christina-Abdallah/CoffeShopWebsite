import { useEffect, useState } from "react";
import { Calendar, Coffee, Check, Pencil } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getAdminReservations, updateReservation } from "../api";

const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
const statusBadge = {
  PENDING: "bg-clay-100 text-clay",
  CONFIRMED: "bg-sage-light text-sage",
  CANCELLED: "bg-rose-light text-rose",
  COMPLETED: "bg-cream-200 text-ink-light",
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ status: "PENDING" });

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    setLoading(true);
    try {
      const data = await getAdminReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    total: reservations.length,
    today: reservations.filter((r) => {
      const today = new Date().toISOString().slice(0, 10);
      return r.date.slice(0, 10) === today;
    }).length,
    confirmed: reservations.filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED").length,
    pending: reservations.filter((r) => r.status === "PENDING").length,
  };

  function startEdit(r) {
    setEditing(r.id);
    setForm({ status: r.status });
  }

  async function handleSave() {
    try {
      await updateReservation(editing, { status: form.status });
      await loadReservations();
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <AdminLayout
      title="Reservations"
      subtitle="Manage table bookings and guest requests."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Bookings" value={stats.total} icon={Calendar} />
        <StatCard label="Today" value={stats.today} icon={Check} />
        <StatCard label="Confirmed" value={stats.confirmed} icon={Coffee} />
        <StatCard label="Pending" value={stats.pending} icon={Calendar} />
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-200 flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-ink">All Reservations</h2>
          <span className="text-sm text-ink-light">{reservations.length} bookings</span>
        </div>
        <div className="divide-y divide-cream-200">
          {loading ? (
            <div className="p-8 text-center text-ink-light">Loading...</div>
          ) : reservations.length === 0 ? (
            <div className="p-8 text-center text-ink-light">No reservations yet</div>
          ) : (
            reservations.map((r) => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-ink-light">{r.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-ink">{r.name}</p>
                    <p className="text-xs text-ink-light">{r.guests} guests • {r.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-ink">{new Date(r.date).toLocaleDateString()}</p>
                    <p className="text-xs text-ink-light">Table TBD</p>
                  </div>

                  {editing === r.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ status: e.target.value })}
                        className="px-2 py-1 rounded-lg border border-cream-200 text-sm"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button onClick={handleSave} className="text-sage font-medium text-sm">Save</button>
                      <button onClick={() => setEditing(null)} className="text-ink-light text-sm">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[r.status]}`}>
                        {r.status.toLowerCase()}
                      </span>
                      <button
                        onClick={() => startEdit(r)}
                        className="p-1.5 rounded-lg hover:bg-cream-100 text-ink-light"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-soft">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-ink-light">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-forest/10 text-forest flex items-center justify-center">
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-display font-semibold text-ink">{value}</p>
    </div>
  );
}
