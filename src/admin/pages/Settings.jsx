import { useEffect, useState } from "react";
import { Trash2, Plus, User, Mail } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useToast } from "../context/ToastContext";
import {
  getProfile,
  updateProfile,
  addProfileEmail,
  deleteProfileEmail,
} from "../api";

// "3 days ago", "1 month ago", etc.
function timeAgo(dateStr) {
  if (!dateStr) return "";

  const then = new Date(dateStr);
  const diffMs = Date.now() - then.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

function Avatar({ src, name }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="size-[128px] rounded-full object-cover border border-[#e9e2d8]"
      />
    );
  }

  const initials = (name || "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="size-[128px] rounded-full bg-white border border-[#e9e2d8] flex items-center justify-center shrink-0">
      {initials ? (
        <span className="font-display font-bold text-[32px] text-[#b55b3e]">
          {initials}
        </span>
      ) : (
        <User size={32} className="text-[#b55b3e]" />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ fullName: "", role: "", email: "" });
  const [saving, setSaving] = useState(false);

  const [addingEmail, setAddingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getProfile();

        if (!cancelled) {
          setProfile(data || null);
          setForm({
            fullName: data?.fullName || "",
            role: data?.role || "",
            email: data?.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);

        if (!cancelled) {
          setProfile(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    setSaving(true);

    try {
      const updated = await updateProfile({
        fullName: form.fullName.trim(),
        role: form.role.trim(),
        // NOTE: include email in the save payload for parity with the
        // design's single "Save" flow. If the API doesn't yet support
        // updating the primary email, this field is simply ignored there.
        email: form.email.trim(),
      });

      setProfile((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddEmail() {
    const trimmed = newEmail.trim();

    if (!trimmed) {
      setAddingEmail(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    try {
      const emails = await addProfileEmail(trimmed);
      setProfile((prev) => ({ ...prev, emails }));
      setNewEmail("");
      setAddingEmail(false);
    } catch (err) {
      console.error("Failed to add email:", err);
      showToast(err.message || "Failed to add email address.", "error");
    }
  }

  async function handleDeleteEmail(id) {
    const confirmed = window.confirm("Remove this email address?");
    if (!confirmed) return;

    try {
      const emails = await deleteProfileEmail(id);
      setProfile((prev) => ({ ...prev, emails }));
    } catch (err) {
      console.error("Failed to delete email:", err);
      showToast(err.message || "Failed to delete email address.", "error");
    }
  }

  const displayName = profile?.name || form.fullName || "Store Manager";

  return (
    <AdminLayout title="Profile Settings">
      <div
        style={{ fontFamily: "'Poppins', sans-serif" }}
        className="flex flex-col gap-[24px]"
      >
        {loading ? (
          <div className="text-[#7c6c67]">Loading...</div>
        ) : (
          <div className="flex w-full max-w-[520px] flex-col gap-[32px] bg-transparent p-0">
            {/* =========================
                IDENTITY — centered photo + name
            ========================== */}
            <div className="flex flex-col items-center gap-[14px]">
              <Avatar src={profile?.avatarUrl} name={displayName} />
              <p className="font-display font-bold text-[18px] text-[#2e221d]">
                {displayName}
              </p>
            </div>

            {/* =========================
                FULL NAME / ROLE / EMAIL — always editable
            ========================== */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-normal text-[#2e221d]">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="h-[48px] rounded-[8px] border border-[#e9e2d8] bg-white px-[16px] text-[14px] text-[#2e221d] placeholder:text-[#a89f98] outline-none focus:border-[#b55b3e]"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-normal text-[#2e221d]">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="Your Role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="h-[48px] rounded-[8px] border border-[#e9e2d8] bg-white px-[16px] text-[14px] text-[#2e221d] placeholder:text-[#a89f98] outline-none focus:border-[#b55b3e]"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-normal text-[#2e221d]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-[48px] rounded-[8px] border border-[#e9e2d8] bg-white px-[16px] text-[14px] text-[#2e221d] placeholder:text-[#a89f98] outline-none focus:border-[#b55b3e]"
                />
              </div>
            </div>

            {/* =========================
                EMAIL ADDRESSES
            ========================== */}
            <div className="flex flex-col gap-[12px]">
              <h3 className="font-display text-[16px] font-medium text-[#2e221d]">
                My email Address
              </h3>

              <div className="flex flex-col gap-[10px]">
                {(profile?.emails || []).map((entry) => (
                  <div key={entry.id} className="flex items-center gap-[12px]">
                    <Mail size={18} className="text-[#b55b3e] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px] text-[#2e221d]">
                        {entry.email}
                      </p>
                      <p className="text-[12px] text-[#7c6c67]">
                        {timeAgo(entry.addedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEmail(entry.id)}
                      className="text-[#c0392b] hover:opacity-70 transition shrink-0"
                      aria-label="Remove email"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}

                {(profile?.emails || []).length === 0 && (
                  <p className="text-[13px] text-[#7c6c67]">
                    No additional email addresses yet.
                  </p>
                )}
              </div>

              {addingEmail ? (
                <div className="flex items-center gap-[8px]">
                  <input
                    type="email"
                    autoFocus
                    placeholder="name@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                    className="flex-1 h-[36px] px-[12px] rounded-[8px] border border-[#e9e2d8] bg-white text-[13px] text-[#2e221d] outline-none focus:border-[#b55b3e]"
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="px-[14px] h-[36px] rounded-[8px] bg-[#b55b3e] text-white text-[13px] font-semibold hover:opacity-90 transition"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingEmail(false);
                      setNewEmail("");
                    }}
                    className="px-[14px] h-[36px] rounded-[8px] border border-[#e9e2d8] text-[#2e221d] text-[13px] hover:bg-[#f7f4f0] transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingEmail(true)}
                  className="flex h-[38px] w-fit items-center gap-[6px] rounded-[8px] bg-[#fbf1ed] px-[16px] text-[13px] font-medium text-[#b55b3e] transition hover:bg-[#f6e3db]"
                >
                  <Plus size={14} />
                  Add New Email
                </button>
              )}
            </div>

            {/* =========================
                SAVE — single persistent action
            ========================== */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-[48px] w-full rounded-[8px] border border-[#b55b3e] bg-white text-[15px] font-medium text-[#2e221d] transition hover:bg-[#b55b3e]/5 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}