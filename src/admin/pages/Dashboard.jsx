import { useEffect, useState } from "react";
import {
  Coffee,
  Calendar,
  Plus,
  ChevronRight,
  // Bell,
  Send,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getDashboard, replyToMessage } from "../api";

function KpiCard({ title, value, delta, deltaTone, footerLabel, icon: Icon }) {
  return (
    <div className="flex h-[142px] flex-col gap-[12px] rounded-[16px] border border-[#e9e2d8] bg-white p-[20px] shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#7c6c67]">{title}</p>
        <div className="bg-[#fbf1ed] rounded-[8px] size-[32px] flex items-center justify-center shrink-0">
          <Icon size={16} className="text-[#b55b3e]" />
        </div>
      </div>
      <p className="font-display font-bold text-[24px] text-[#2e221d] leading-none">{value}</p>
      <div className="flex items-center gap-[4px] text-[12px]">
        <span
          className={`font-semibold ${
            deltaTone === "negative" ? "text-[#b53e3e]" : delta ? "text-[#1a6f54]" : "text-[#7c6c67]"
          }`}
        >
          {delta || "—"}
        </span>
        {footerLabel && <span className="text-[#7c6c67]">{footerLabel}</span>}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-[64px] w-full items-center gap-[14px] rounded-[10px] border border-[#e9e2d8] bg-[#f7f4f0] p-[14px] text-left transition hover:border-[#b55b3e]/40 sm:flex-1"
    >
      <div className="bg-white border border-[#e9e2d8] rounded-full size-[36px] flex items-center justify-center shrink-0">
        <Icon size={16} className="text-[#2e221d]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#2e221d] truncate">{title}</p>
        <p className="text-[12px] text-[#7c6c67] truncate">{subtitle}</p>
      </div>
      <ChevronRight size={14} className="text-[#7c6c67] shrink-0" />
    </button>
  );
}

// Reply modal: opens when a message is clicked, darkens the background,
// shows the sender's name + email on top and the full message (scrollable
// if long), with a reply box pinned at the bottom.
function MessageReplyModal({ message, onClose, onSent }) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!message) return null;

  const handleSend = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      await replyToMessage(message.id, replyText.trim());
      onSent?.(message.id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-[16px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[570px] rounded-[19px] bg-[#f5f5f5] px-[7px] py-[6px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid h-[26px] grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-[12px]">
          <div className="min-w-0">
            <p className="truncate text-[20px] font-semibold leading-[26px] text-[#2e221d]">
              {message.fullName}
            </p>
          </div>
          <p className="max-w-[220px] truncate pt-[7px] text-right text-[13px] font-extralight leading-[17px] text-[#2e221d]">
            {message.email || "customer-email@gmail.com"}
          </p>
          <button
            onClick={onClose}
            className="shrink-0 text-[#7c6c67] hover:text-[#2e221d]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-[9px] flex h-[204px] flex-col overflow-hidden rounded-[13px] border border-[#e9e2d8] bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto px-[17px] pt-[14px] text-[13px] leading-[17px] text-[#2e221d]">
            {message.message}
          </div>

          {error && (
            <p className="px-[17px] pb-[4px] text-[12px] text-[#b53e3e]">{error}</p>
          )}

          <div className="flex h-[35px] shrink-0 items-center gap-[10px] border-t border-[#e9e2d8] px-[17px]">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Reply"
              className="h-full flex-1 bg-transparent text-[13px] text-[#2e221d] placeholder:text-[#2e221d]/50 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={sending || !replyText.trim()}
              className="flex size-[24px] shrink-0 items-center justify-center text-[#2e221d] disabled:opacity-40"
              aria-label="Send reply"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    // Avoid updating state after the component has unmounted
    let cancelled = false;

    getDashboard()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading)
    return (
      <AdminLayout title="Dashboard" subtitle="Loading...">
        <div className="text-[#7c6c67]">Loading...</div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout title="Dashboard">
        <div className="text-rose">{error}</div>
      </AdminLayout>
    );

  const { kpis, recentMessages } = data || {};

  return (
    <AdminLayout
      title="Café Overview"
      subtitle="Here's how Brew & Co. is performing today."
    >
      <div style={{ fontFamily: "'Geist', sans-serif" }} className="flex w-full flex-col gap-[33px]">
        {/* Only 2 KPI cards, per the design: Active Reservations + Popular Item */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          <KpiCard
            title="Active Reservations"
            value={`${kpis?.activeReservations ?? 0} tables`}
            delta={kpis?.reservationsDelta}
            deltaTone={kpis?.reservationsDelta?.startsWith("-") ? "negative" : "positive"}
            footerLabel="from yesterday"
            icon={Calendar}
          />
          <KpiCard
            title="Popular Item"
            value={kpis?.popularItem || "N/A"}
            delta={kpis?.popularItemSold ? `${kpis.popularItemSold} sold` : null}
            deltaTone="positive"
            footerLabel="today"
            icon={Coffee}
          />
        </div>

        <div className="flex min-h-[154px] flex-col justify-center gap-[20px] rounded-[16px] border border-[#e9e2d8] bg-white px-[10px] py-[16px] sm:h-[154px] sm:flex-row sm:items-center sm:justify-start sm:gap-[106px]">
          <h2 className="mb-0 shrink-0 font-display text-[24px] font-bold leading-[30px] text-[#2e221d] sm:w-[234px]">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-[16px] sm:flex-1 sm:flex-row sm:gap-[106px]">
            <QuickAction
              icon={Plus}
              title="Add Menu Item"
              subtitle="Create a new beverage or pastry"
              onClick={() => navigate("/admin/menu")}
            />
            <QuickAction
              icon={Calendar}
              title="New Reservation"
              subtitle="Book a table for a customer"
              onClick={() => navigate("/admin/reservations")}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[16px] border border-[#e9e2d8] bg-white shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)]">
          <div className="flex h-[58px] items-center justify-between border-b border-[#e9e2d8] px-[24px] py-[20px]">
            <h2 className="font-display font-bold text-[16px] text-[#2e221d]">Messages</h2>
            <span className="border border-[#b55b3e] rounded-full px-[10px] py-[4px] text-[11px] font-bold text-[#1e1e1e]">
              ALL
            </span>
          </div>
          <div className="divide-y divide-[#e9e2d8] px-[24px]">
            {recentMessages?.length > 0 ? (
              recentMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className="flex h-[61px] w-full items-center gap-[12px] py-[12px] text-left"
                >
                  <div className="size-[8px] rounded-full bg-[#b55b3e] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#2e221d] truncate">
                      {msg.fullName}
                    </p>
                    <p className="text-[13px] text-[#7c6c67] truncate">{msg.message}</p>
                  </div>
                  <span className="text-[12px] text-[#7c6c67] whitespace-nowrap shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            ) : (
              <div className="py-[32px] text-center text-[#7c6c67]">No new messages</div>
            )}
          </div>
        </div>
      </div>

      <MessageReplyModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </AdminLayout>
  );
}