import { useEffect, useState } from "react";
import { Trash2, Plus, User } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import {
  getProfile,
  updateProfile,
  addProfileEmail,
  deleteProfileEmail,
} from "../api";

function formatLongDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
        className="size-[64px] rounded-full object-cover border border-[#e9e2d8]"
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
    <div className="size-[100px] rounded-full bg-white border border-[#e9e2d8] flex items-center justify-center shrink-0">
      {initials ? (
        <span className="font-display font-bold text-[20px] text-[#b55b3e]">
          {initials}
        </span>
      ) : (
        <User size={24} className="text-[#b55b3e]" />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", role: "" });
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
      });

      setProfile((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setForm({
      fullName: profile?.fullName || "",
      role: profile?.role || "",
    });
    setIsEditing(false);
  }

  async function handleAddEmail() {
    const trimmed = newEmail.trim();

    if (!trimmed) {
      setAddingEmail(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const emails = await addProfileEmail(trimmed);
      setProfile((prev) => ({ ...prev, emails }));
      setNewEmail("");
      setAddingEmail(false);
    } catch (err) {
      console.error("Failed to add email:", err);
      alert(err.message || "Failed to add email address.");
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
      alert(err.message || "Failed to delete email address.");
    }
  }

  const displayName = profile?.name || "Store Manager";

  return (
    <AdminLayout
      title={
        <>
          Welcome <span className="font-display font-bold">{displayName}</span>
        </>
      }
      subtitle={formatLongDate(new Date())}
    >
      <div
        style={{ fontFamily: "'Poppins', sans-serif" }}
        className="flex flex-col gap-[24px]"
      >
        {loading ? (
          <div className="text-[#7c6c67]">Loading...</div>
        ) : (
          <div className="flex w-full flex-col gap-[46px] bg-transparent p-0">
            {/* =========================
                IDENTITY
            ========================== */}
            <div className="flex items-start justify-between gap-[16px] lg:w-[calc(100vw-390px)]">
              <div className="flex items-center gap-[24px]">
                <Avatar src={profile?.avatarUrl} name={displayName} />

                <div>
                  <p className="font-display font-bold text-[16px] text-[#2e221d]">
                    {displayName}
                  </p>
                  <p className="text-[13px] text-[#7c6c67]">
                    {profile?.email || "—"}
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="relative lg:top-[9px] h-[44px] rounded-[8px] border border-[#b55b3e] px-[32px] text-[16px] font-normal text-[#2e221d] transition hover:bg-[#b55b3e]/5"
                >
                  Edit
                </button>
              )}
            </div>

            {/* =========================
                FULL NAME / ROLE
            ========================== */}
            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 sm:gap-x-[58px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[16px] font-normal text-[#2e221d]">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={isEditing ? form.fullName : ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="h-[52px] rounded-[8px] border border-[#e9e2d8] bg-white px-[20px] text-[16px] text-[#2e221d] placeholder:text-[#a89f98] outline-none focus:border-[#b55b3e] disabled:bg-white disabled:text-[#7c6c67]"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[16px] font-normal text-[#2e221d]">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="Your Role"
                  value={profile?.role || ""}
                  disabled={true}
                  readOnly={true}
                  className="h-[52px] rounded-[8px] border border-[#e9e2d8] bg-[#f7f4f0] px-[20px] text-[16px] text-[#7c6c67] outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-[12px] -mt-[12px]">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-[18px] py-[8px] rounded-[8px] bg-[#b55b3e] text-white text-[13px] font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="px-[18px] py-[8px] rounded-[8px] border border-[#e9e2d8] text-[#2e221d] text-[13px] font-semibold hover:bg-[#f7f4f0] transition"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* =========================
                EMAIL ADDRESSES
            ========================== */}
            <div className="flex flex-col gap-[12px]">
              <h3 className="font-display text-[18px] font-medium text-[#2e221d]">
                My email Address
              </h3>

              <div className="flex flex-col gap-[10px]">
                { (profile?.emails || []).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-[12px] py-[6px]"
                  >
                  <div className="flex size-[48px] shrink-0 items-center justify-center rounded-[10px] border border-[#f1ddd5] bg-[#b55b3e]/10">
                    <img
                      src="/email-icon.svg"
                      alt=""
                      width="24"
                      height="24"
                    />
                    </div>

                    <div className="relative -top-[7px] ml-[10px] text-[#7c6c67] hover:text-[#2e221d] transition shrink-0">
                      <p className="truncate text-[16px] text-[#2e221d]">
                        {entry.email}
                      </p>
                      <p className="text-[16px] text-[#7c6c67]">
                        {timeAgo(entry.addedAt)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEmail(entry.id)}
                      className="text-[#7c6c67] hover:text-[#2e221d] transition shrink-0"
                      aria-label="Remove email"
                    >
                      <Trash2 size={24} />
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
                  className="flex h-[44px] w-[209px] items-center gap-[6px] rounded-[8px] border border-[#b55b3e] px-[24px] text-[16px] font-normal text-[#b55b3e] transition hover:bg-[#fbf1ed]"
                >
                  <Plus size={14} />
                  Add Email Address
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}