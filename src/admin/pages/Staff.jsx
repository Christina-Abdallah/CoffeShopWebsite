import { Bell, Plus, Pencil, X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useToast } from "../context/ToastContext";
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../api";

const roles = [
  "Store Manager",
  "Head Barista",
  "Senior Barista",
  "Pastry Chef",
  "Roaster & QA",
  "Service Specialist",
];

const statuses = ["ON_SHIFT", "ON_BREAK", "OFF_DUTY"];

const statusBadge = {
  ON_SHIFT: "bg-[#e8f5e9] text-[#1e7e34] border-[#c8e6c9]",
  ON_BREAK: "bg-[#fff8e1] text-[#b78103] border-[#ffe0b2]",
  OFF_DUTY: "bg-[#f5f5f5] text-[#616161] border-[#e0e0e0]",
};

// Note: `status` (ON_SHIFT / ON_BREAK / OFF_DUTY) still lives in the data
// model and stat cards, but per the design it's no longer an editable field
// in the Add/Edit modal — it's carried over as-is on save.

// Rotating avatar colors, matching the design's varied initials badges.
const AVATAR_COLORS = ["#b55b3e", "#152e20", "#2c5aa0", "#c23b7a", "#0e7c86"];

// 30-minute time slots from 7:00 AM to 9:00 PM
const timeSlots = Array.from({ length: 29 }, (_, i) => {
  const totalMinutes = 7 * 60 + i * 30;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;

  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
});

const emptyForm = {
  firstName: "",
  lastName: "",
  role: "Head Barista",
  email: "",
  status: "OFF_DUTY",
  shiftStart: "07:00",
  shiftEnd: "15:00",
};

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-[14px] p-[12px] sm:p-[16px] border border-[#e9e2d8] shadow-[0px_4px_6px_0px_rgba(46,34,29,0.02)] flex flex-col items-center gap-[4px] text-center">
      <p className="font-display font-bold text-[20px] sm:text-[24px] text-[#2e221d] leading-none">
        {value}
      </p>
      <p className="text-[11px] font-medium text-[#7c6c67]">{label}</p>
    </div>
  );
}

/*
 * A single-row field with an inline prefix label inside the same box,
 * e.g. "Role:  Manager, cashier, . . ." — matches the design's Add Staff form.
 */
function LabeledField({ label, children, className = "" }) {
  return (
    <div
      className={`flex items-center gap-[6px] h-[44px] rounded-[8px] border border-[#e9e2d8] bg-white px-[14px] ${className}`}
    >
      <span className="text-[13px] font-medium text-[#7c6c67] whitespace-nowrap shrink-0">
        {label}
      </span>
      {children}
    </div>
  );
}

function StaffCard({ member, index, onEdit, onDelete }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = (member.fullName || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-[14px] border border-[#e9e2d8] p-[14px] flex flex-col gap-[10px] shadow-[0px_2px_6px_0px_rgba(46,34,29,0.02)]">
      <div className="flex items-center gap-[12px]">
        <div
          className="size-[40px] rounded-full flex items-center justify-center text-[13px] font-semibold text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-[#2e221d] truncate">{member.fullName}</p>
          <p className="text-[13px] text-[#7c6c67] truncate">{member.role}</p>
        </div>
        <div className="flex items-center gap-[6px] shrink-0">
          <button
            onClick={() => onEdit(member)}
            className="bg-[#f7f4f0] rounded-[6px] p-[7px] hover:bg-[#e9e2d8] transition"
            aria-label="Edit"
          >
            <Pencil size={13} className="text-[#2e221d]" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="bg-[#f7f4f0] rounded-[6px] p-[7px] hover:bg-rose-100 transition text-[#7c6c67]"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-[8px]">
        <span className="flex items-center gap-[6px] text-[12px] text-[#7c6c67] shrink-0">
          <Bell size={12} />
          {member.shiftStart && member.shiftEnd
            ? `${member.shiftStart} – ${member.shiftEnd}`
            : "—"}
        </span>
        <span className="text-[12px] font-medium text-[#b55b3e] truncate">{member.email}</span>
      </div>
    </div>
  );
}

export default function AdminStaff() {
  const { showToast } = useToast();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // null = modal closed, "new" = creating, id = editing
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialStaff() {
      try {
        const data = await getStaff();

        if (!cancelled) {
          setStaff(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load staff:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInitialStaff();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadStaff() {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      console.error("Failed to reload staff:", err);
      throw err;
    }
  }

  const searchValue = search.toLowerCase().trim();

  const filtered = staff.filter((member) => {
    const fullName = member.fullName?.toLowerCase() || "";
    const role = member.role?.toLowerCase() || "";

    return fullName.includes(searchValue) || role.includes(searchValue);
  });

  const stats = {
    total: staff.length,
    onShift: staff.filter((member) => member.status === "ON_SHIFT").length,
    onBreak: staff.filter((member) => member.status === "ON_BREAK").length,
    offDuty: staff.filter((member) => member.status === "OFF_DUTY").length,
  };

  function startEdit(member) {
    const [firstName, ...rest] = (member.fullName || "").split(" ");

    setEditing(member.id);

    setForm({
      firstName: firstName || "",
      lastName: rest.join(" "),
      role: member.role || "",
      email: member.email || "",
      status: member.status || "OFF_DUTY",
      shiftStart: member.shiftStart || "",
      shiftEnd: member.shiftEnd || "",
    });
  }

  function startCreate() {
    setEditing("new");
    setForm({ ...emptyForm });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSave() {
    const fullName = `${form.firstName} ${form.lastName}`.trim();

    if (!fullName) {
      showToast("Please enter the staff member's name.", "error");
      return;
    }

    if (!form.role?.trim()) {
      showToast("Please enter a role for the staff member.", "error");
      return;
    }

    if (!form.email.trim()) {
      showToast("Please enter an email address.", "error");
      return;
    }

    // Status isn't exposed in this form (it's not part of the design), so we
    // simply carry over whatever was loaded on startEdit/startCreate.
    const payload = {
      fullName,
      role: form.role.trim(),
      email: form.email.trim(),
      status: form.status,
      shiftStart: form.shiftStart,
      shiftEnd: form.shiftEnd,
    };

    try {
      if (editing === "new") {
        await createStaff(payload);
      } else {
        await updateStaff(editing, payload);
      }

      await loadStaff();

      setEditing(null);
      setForm({ ...emptyForm });
    } catch (err) {
      showToast(err.message || "Failed to save staff member.", "error");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Remove this staff member?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteStaff(id);
      await loadStaff();
    } catch (err) {
      showToast(err.message || "Failed to delete staff member.", "error");
    }
  }

  return (
    <AdminLayout
      title="Staff Crew"
      search={search}
      onSearchChange={setSearch}
      extraAction={{ icon: Plus, onClick: startCreate, label: "Add staff" }}
    >
      <div style={{ fontFamily: "'Geist', sans-serif" }} className="flex flex-col gap-[20px]">

        {/* Statistics — 4 across, no icons */}
        <div className="grid grid-cols-4 gap-[8px] sm:gap-[16px]">
          <StatCard label="Total Crew" value={stats.total} />
          <StatCard label="On Shift" value={stats.onShift} />
          <StatCard label="On Break" value={stats.onBreak} />
          <StatCard label="Off Duty" value={stats.offDuty} />
        </div>

        {/* Staff list */}
        <div className="flex flex-col gap-[12px]">
          {loading ? (
            <div className="p-8 text-center text-[#7c6c67]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-[#7c6c67]">No staff found</div>
          ) : (
            filtered.map((member, index) => (
              <StaffCard
                key={member.id}
                member={member}
                index={index}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {editing !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          <div
            className="relative bg-[#f7f4f0] border-2 border-[#e9e2d8] rounded-[19px] p-[24px] w-full max-w-[420px] flex flex-col gap-[12px]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setEditing(null)}
              className="absolute -top-3 -right-3 bg-white border border-[#e9e2d8] rounded-full p-1.5 text-[#7c6c67] hover:text-[#2e221d] shadow-sm"
            >
              <X size={16} />
            </button>

            <h3 className="font-display font-bold text-[20px] text-[#2e221d] mb-[4px]">
              {editing === "new" ? "Add Staff Member" : "Edit Staff Member"}
            </h3>

            {/* First / Last name */}
            <div className="grid grid-cols-2 gap-[12px]">
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleFormChange}
                className="h-[44px] px-[14px] rounded-[8px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleFormChange}
                className="h-[44px] px-[14px] rounded-[8px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              />
            </div>

            {/* Role — free text, inline label */}
            <LabeledField label="Role:">
              <input
                name="role"
                placeholder="Manager, cashier, . . ."
                value={form.role}
                onChange={handleFormChange}
                className="flex-1 min-w-0 bg-transparent text-[13px] text-[#2e221d] placeholder:text-[#a89f98] outline-none"
              />
            </LabeledField>

            {/* Email — inline label */}
            <LabeledField label="Member Email:">
              <input
                name="email"
                type="email"
                placeholder="Example@gmail.com"
                value={form.email}
                onChange={handleFormChange}
                className="flex-1 min-w-0 bg-transparent text-[13px] text-[#2e221d] placeholder:text-[#a89f98] outline-none"
              />
            </LabeledField>

            {/* Shift start / finish — inline labels, side by side */}
            <div className="grid grid-cols-2 gap-[12px]">
              <LabeledField label="Start shift at">
                <select
                  name="shiftStart"
                  value={form.shiftStart}
                  onChange={handleFormChange}
                  className="flex-1 min-w-0 bg-transparent text-[13px] text-[#2e221d] outline-none"
                >
                  <option value="">—</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </LabeledField>

              <LabeledField label="Finish shift at">
                <select
                  name="shiftEnd"
                  value={form.shiftEnd}
                  onChange={handleFormChange}
                  className="flex-1 min-w-0 bg-transparent text-[13px] text-[#2e221d] outline-none"
                >
                  <option value="">—</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </LabeledField>
            </div>

            {/* Form actions */}
            <div className="flex items-center gap-[16px] mt-[8px]">
              <button
                onClick={handleSave}
                className="flex-1 bg-[#b55b3e] text-white rounded-[8px] px-[20px] py-[10px] text-[14px] font-semibold hover:opacity-90 transition"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(null)}
                className="flex-1 border border-[#e9e2d8] text-[#7c6c67] rounded-[8px] px-[20px] py-[10px] text-[14px] font-medium hover:bg-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}