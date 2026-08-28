import { 
  UsersRound, 
  Clock, 
  Plus, 
  Pencil, 
  X, 
  Trash2, 
} from "lucide-react";
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

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-[16px] p-[20px] border border-[#e9e2d8] shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)] flex flex-col gap-[12px]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#7c6c67]">
          {label}
        </p>

        <div className="bg-[#fbf1ed] rounded-[8px] size-[32px] flex items-center justify-center shrink-0">
          <Icon size={16} className="text-[#b55b3e]" />
        </div>
      </div>

      <p className="font-display font-bold text-[24px] text-[#2e221d] leading-none">
        {value}
      </p>
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

  /*
   * --------------------------------------------------
   * INITIAL LOAD
   * --------------------------------------------------
   *
   * We do not call loadStaff() directly inside useEffect
   * because loadStaff() contains state updates.
   */
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

  /*
   * --------------------------------------------------
   * RELOAD STAFF
   * --------------------------------------------------
   *
   * Used after creating, editing, or deleting a staff member.
   */
  async function loadStaff() {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      console.error("Failed to reload staff:", err);
      throw err;
    }
  }

  /*
   * --------------------------------------------------
   * SEARCH
   * --------------------------------------------------
   */
  const searchValue = search.toLowerCase().trim();

  const filtered = staff.filter((member) => {
    const fullName = member.fullName?.toLowerCase() || "";
    const role = member.role?.toLowerCase() || "";

    return (
      fullName.includes(searchValue) ||
      role.includes(searchValue)
    );
  });

  /*
   * --------------------------------------------------
   * STAFF STATISTICS
   * --------------------------------------------------
   */
  const stats = {
    total: staff.length,

    onShift: staff.filter(
      (member) => member.status === "ON_SHIFT"
    ).length,

    onBreak: staff.filter(
      (member) => member.status === "ON_BREAK"
    ).length,

    offDuty: staff.filter(
      (member) => member.status === "OFF_DUTY"
    ).length,
  };

  /*
   * --------------------------------------------------
   * GET INITIALS
   * --------------------------------------------------
   */
  function initials(name = "") {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  /*
   * --------------------------------------------------
   * EDIT STAFF MEMBER
   * --------------------------------------------------
   */
  function startEdit(member) {
    const [firstName, ...rest] =
      (member.fullName || "").split(" ");

    setEditing(member.id);

    setForm({
      firstName: firstName || "",
      lastName: rest.join(" "),
      role: member.role || "Barista",
      email: member.email || "",
      status: member.status || "OFF_DUTY",
      shiftStart: member.shiftStart || "",
      shiftEnd: member.shiftEnd || "",
    });
  }

  /*
   * --------------------------------------------------
   * CREATE STAFF MEMBER
   * --------------------------------------------------
   */
  function startCreate() {
    setEditing("new");

    setForm({
      ...emptyForm,
    });
  }

  /*
   * --------------------------------------------------
   * HANDLE FORM CHANGES
   * --------------------------------------------------
   */
  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /*
   * --------------------------------------------------
   * SAVE STAFF MEMBER
   * --------------------------------------------------
   */
  async function handleSave() {
    const fullName =
      `${form.firstName} ${form.lastName}`.trim();

    if (!fullName) {
      showToast("Please enter the staff member's name.", "error");
      return;
    }

    if (!form.email.trim()) {
      showToast("Please enter an email address.", "error");
      return;
    }

    const payload = {
      fullName,
      role: form.role,
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
      setForm({
        ...emptyForm,
      });
    } catch (err) {
      showToast(err.message || "Failed to save staff member.", "error");
    }
  }

  /*
   * --------------------------------------------------
   * DELETE STAFF MEMBER
   * --------------------------------------------------
   */
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
  title="Staff Management"
  subtitle="Manage shifts, roles, and contacts of your store crew."
  search={search}
  onSearchChange={setSearch}
>
      <div
        style={{ fontFamily: "'Geist', sans-serif" }}
        className="flex flex-col gap-[32px]"
      >
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <StatCard
            label="Total Employees"
            value={`${stats.total} Staff`}
            icon={UsersRound}
          />

          <StatCard
            label="On Shift Today"
            value={`${stats.onShift} Active`}
            icon={Clock}
          />

          <StatCard
            label="On Break"
            value={`${stats.onBreak} Break`}
            icon={Clock}
          />

          <StatCard
            label="Off Duty"
            value={`${stats.offDuty} Off`}
            icon={UsersRound}
          />
        </div>

        {/* Staff table */}
        <div className="bg-white rounded-[16px] border border-[#e9e2d8] shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)] overflow-hidden">
          {/* Table header */}
          <div className="px-[24px] py-[20px] border-b border-[#e9e2d8] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
            <h2 className="font-display font-bold text-[18px] text-[#2e221d]">
              All Staff Members
            </h2>

            <div className="flex items-center gap-[12px]">
              

              {/* Add Staff button */}
              <button
                onClick={startCreate}
                className="flex items-center gap-[8px] px-[16px] py-[10px] rounded-[8px] bg-[#b55b3e] text-white text-[13px] font-semibold hover:opacity-90 transition whitespace-nowrap"
              >
                <Plus size={14} />
                Add Staff
              </button>
            </div>
          </div>

          {/* Staff table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#e9e2d8]">
                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Full Name
                  </th>

                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Role
                  </th>

                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Status
                  </th>

                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Shift Time
                  </th>

                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Contact Email
                  </th>

                  <th className="px-[24px] py-[16px]"></th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-[#7c6c67]"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-8 text-center text-[#7c6c67]"
                    >
                      No staff found
                    </td>
                  </tr>
                ) : (
                  filtered.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-[#e9e2d8] last:border-0 hover:bg-[#f7f4f0]/50"
                    >
                      {/* Full name */}
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="size-[36px] rounded-full bg-[#b55b3e]/15 text-[#b55b3e] flex items-center justify-center text-[13px] font-semibold shrink-0">
                            {initials(member.fullName)}
                          </div>

                          <span className="font-semibold text-[14px] text-[#2e221d]">
                            {member.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-[24px] py-[16px] text-[14px] text-[#7c6c67]">
                        {member.role}
                      </td>

                      {/* Status */}
                      <td className="px-[24px] py-[16px]">
                        <span
                          className={`px-[12px] py-[4px] rounded-full text-[12px] font-medium ${
                            statusBadge[member.status] ||
                            statusBadge.OFF_DUTY
                          }`}
                        >
                          {(member.status || "OFF_DUTY").replace(
                            "_",
                            " "
                          )}
                        </span>
                      </td>

                      {/* Shift time */}
                      <td className="px-[24px] py-[16px] text-[14px] text-[#7c6c67]">
                        {member.shiftStart &&
                        member.shiftEnd
                          ? `${member.shiftStart} – ${member.shiftEnd}`
                          : "—"}
                      </td>

                      {/* Email */}
                      <td className="px-[24px] py-[16px] text-[14px] text-[#7c6c67]">
                        {member.email}
                      </td>

                      {/* Actions */}
                      <td className="px-[24px] py-[16px]">
                        <div className="flex items-center gap-[8px] justify-end">
                          <button
                            onClick={() => startEdit(member)}
                            className="bg-[#f7f4f0] rounded-[6px] p-[8px] hover:bg-[#e9e2d8] transition"
                          >
                            <Pencil
                              size={14}
                              className="text-[#2e221d]"
                            />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(member.id)
                            }
                            className="bg-[#f7f4f0] rounded-[6px] p-[8px] hover:bg-rose-100 transition text-[#7c6c67]"
                          >
                            <Trash2 size={14} />
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
      </div>

      {/* Add / Edit modal */}
      {editing !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditing(null)}
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          <div
            className="relative bg-[#f7f4f0] border-2 border-[#e9e2d8] rounded-[19px] p-[24px] w-full max-w-[520px]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setEditing(null)}
              className="absolute -top-3 -right-3 bg-white border border-[#e9e2d8] rounded-full p-1.5 text-[#7c6c67] hover:text-[#2e221d] shadow-sm"
            >
              <X size={16} />
            </button>

            {/* Modal title */}
            <h3 className="font-display font-bold text-[20px] text-[#2e221d] mb-[20px]">
              {editing === "new"
                ? "Add Staff Member"
                : "Edit Staff Member"}
            </h3>

            {/* Personal information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[16px]">
              {/* First name */}
              <input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleFormChange}
                className="h-[38px] px-[16px] rounded-[7px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              />

              {/* Last name */}
              <input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleFormChange}
                className="h-[38px] px-[16px] rounded-[7px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              />

              {/* Role */}
              <select
                name="role"
                value={form.role}
                onChange={handleFormChange}
                className="h-[38px] px-[16px] rounded-[7px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              {/* Email */}
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleFormChange}
                className="h-[38px] px-[16px] rounded-[7px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              />

              {/* Status */}
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="h-[38px] px-[16px] rounded-[7px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e] sm:col-span-2"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift time */}
            <p className="text-[12px] font-medium text-[#7c6c67] mb-[8px]">
              Shift Time
            </p>

            <div className="grid grid-cols-2 gap-[12px] mb-[24px]">
              {/* Start time */}
              <select
                name="shiftStart"
                value={form.shiftStart}
                onChange={handleFormChange}
                className="h-[38px] px-[16px] rounded-[7px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              >
                <option value="">Start</option>

                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              {/* End time */}
              <select
                name="shiftEnd"
                value={form.shiftEnd}
                onChange={handleFormChange}
                className="h-[38px] px-[16px] rounded-[7px] border border-[#e9e2d8] bg-white text-[14px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
              >
                <option value="">Finish</option>

                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Form actions */}
            <div className="flex items-center gap-[16px]">
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