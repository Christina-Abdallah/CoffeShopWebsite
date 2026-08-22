import { useEffect, useState } from "react";
import { UsersRound, Clock, Search, Plus, Pencil, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getStaff, createStaff, updateStaff, deleteStaff } from "../api";

const roles = ["Store Manager", "Head Barista", "Barista", "Pastry Chef", "Cashier"];
const statuses = ["ON_SHIFT", "ON_BREAK", "OFF_DUTY"];
const statusBadge = {
  ON_SHIFT: "bg-sage-light text-sage",
  ON_BREAK: "bg-clay-100 text-clay",
  OFF_DUTY: "bg-cream-200 text-ink-light",
};

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    role: "Barista",
    email: "",
    status: "OFF_DUTY",
    shiftStart: "",
    shiftEnd: "",
  });

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = staff.filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: staff.length,
    onShift: staff.filter((m) => m.status === "ON_SHIFT").length,
    onBreak: staff.filter((m) => m.status === "ON_BREAK").length,
    offDuty: staff.filter((m) => m.status === "OFF_DUTY").length,
  };

  function initials(name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function startEdit(m) {
    setEditing(m.id);
    setForm({
      fullName: m.fullName,
      role: m.role,
      email: m.email,
      status: m.status,
      shiftStart: m.shiftStart || "",
      shiftEnd: m.shiftEnd || "",
    });
  }

  function startCreate() {
    setEditing("new");
    setForm({
      fullName: "",
      role: "Barista",
      email: "",
      status: "OFF_DUTY",
      shiftStart: "",
      shiftEnd: "",
    });
  }

  async function handleSave() {
    try {
      if (editing === "new") {
        await createStaff(form);
      } else {
        await updateStaff(editing, form);
      }
      await loadStaff();
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this staff member?")) return;
    try {
      await deleteStaff(id);
      await loadStaff();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <AdminLayout
      title="Staff Management"
      subtitle="Manage shifts, roles, and contacts of your store crew."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Employees" value={`${stats.total} Staff`} icon={UsersRound} />
        <StatCard label="On Shift Today" value={`${stats.onShift} Active`} icon={Clock} />
        <StatCard label="On Break" value={`${stats.onBreak} Break`} icon={Clock} />
        <StatCard label="Off Duty" value={`${stats.offDuty} Off`} icon={UsersRound} />
      </div>

      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-display font-semibold text-ink">All Staff Members</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-cream-200 bg-cream-50 text-sm text-ink focus:border-clay outline-none w-full sm:w-64"
              />
            </div>
            <button
              onClick={startCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-cream text-sm font-medium hover:bg-forest-light transition"
            >
              <Plus size={18} />
              Add Staff
            </button>
          </div>
        </div>

        {editing && (
          <div className="p-5 border-b border-cream-200 bg-cream-50">
            <h3 className="text-base font-display font-semibold text-ink mb-4">
              {editing === "new" ? "Add Staff Member" : "Edit Staff Member"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="px-4 py-2 rounded-xl border border-cream-200 bg-white text-ink outline-none focus:border-clay"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="px-4 py-2 rounded-xl border border-cream-200 bg-white text-ink outline-none focus:border-clay"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-2 rounded-xl border border-cream-200 bg-white text-ink outline-none focus:border-clay"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="px-4 py-2 rounded-xl border border-cream-200 bg-white text-ink outline-none focus:border-clay"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <input
                type="time"
                value={form.shiftStart}
                onChange={(e) => setForm({ ...form, shiftStart: e.target.value })}
                className="px-4 py-2 rounded-xl border border-cream-200 bg-white text-ink outline-none focus:border-clay"
              />
              <input
                type="time"
                value={form.shiftEnd}
                onChange={(e) => setForm({ ...form, shiftEnd: e.target.value })}
                className="px-4 py-2 rounded-xl border border-cream-200 bg-white text-ink outline-none focus:border-clay"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-forest text-cream text-sm font-medium hover:bg-forest-light"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl border border-cream-200 text-ink-light text-sm hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-cream-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-ink-light uppercase tracking-wider">Full Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-ink-light uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-ink-light uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-ink-light uppercase tracking-wider">Shift Time</th>
                <th className="px-5 py-3 text-xs font-semibold text-ink-light uppercase tracking-wider">Contact Email</th>
                <th className="px-5 py-3 text-xs font-semibold text-ink-light uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-ink-light">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-ink-light">No staff found</td></tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-cream-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-clay-100 text-clay flex items-center justify-center text-xs font-semibold">
                          {initials(m.fullName)}
                        </div>
                        <span className="font-medium text-ink">{m.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-light">{m.role}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[m.status]}`}>
                        {m.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink-light text-sm">
                      {m.shiftStart && m.shiftEnd ? `${m.shiftStart} - ${m.shiftEnd}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-ink-light text-sm">{m.email}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => startEdit(m)}
                          className="p-1.5 rounded-lg hover:bg-cream-100 text-ink-light"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-light text-ink-light hover:text-rose"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
