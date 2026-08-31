import { useEffect, useMemo, useState } from "react";
import { Coffee, Calendar, Send, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useAdmin } from "../useAdmin";
import { getDashboard, getMessages, replyToMessage, updateMessageStatus } from "../api";

const MESSAGES_PAGE_SIZE = 5;

const FALLBACK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "reservation",
    priority: "high",
    label: "New reservation",
    description: "6 pers., 19h30 (Jordan Lee)",
    ago: "2 min ago",
  },
  {
    id: "n2",
    type: "stock",
    priority: "medium",
    label: "Low stock",
    description: "Cheesecake (plus que 2)",
    ago: "12 min ago",
  },
  {
    id: "n3",
    type: "table",
    priority: "high",
    label: "Table waiting",
    description: "Table 7 – waiting for 10 min",
    ago: "10 min ago",
  },
];

function formatRelativeTime(dateInput) {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString();
}

function KpiCard({
  title,
  value,
  delta,
  deltaTone,
  footerLabel,
  icon: Icon,
}) {
  return (
    <div className="flex h-[142px] flex-col gap-[10px] sm:gap-[12px] rounded-[16px] border border-[#e9e2d8] bg-white p-[14px] sm:p-[20px] shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)]">
      <div className="flex items-center justify-between gap-[8px]">
        <p className="text-[12px] sm:text-[13px] font-medium text-[#7c6c67] leading-tight">
          {title}
        </p>

        <div className="bg-[#fbf1ed] rounded-[8px] size-[28px] sm:size-[32px] flex items-center justify-center shrink-0">
          <Icon size={15} className="text-[#b55b3e]" />
        </div>
      </div>

      <p className="font-display font-bold text-[20px] sm:text-[24px] text-[#2e221d] leading-none truncate">
        {value}
      </p>

      <div className="flex items-center gap-[4px] text-[11px] sm:text-[12px]">
        <span
          className={`font-semibold ${
            deltaTone === "negative"
              ? "text-[#b53e3e]"
              : delta
                ? "text-[#1a6f54]"
                : "text-[#7c6c67]"
          }`}
        >
          {delta || "—"}
        </span>

        {footerLabel && (
          <span className="text-[#7c6c67] truncate">
            {footerLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function MessageReplyModal({ message, onClose, onSent }) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!message) {
    return null;
  }

  const handleSend = async () => {
    if (!replyText.trim() || sending) {
      return;
    }

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
      className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-[16px]"
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
            {message.email || "customer@gmail.com"}
          </p>

          <button
            type="button"
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
            <p className="px-[17px] pb-[4px] text-[12px] text-[#b53e3e]">
              {error}
            </p>
          )}

          <div className="flex h-[35px] shrink-0 items-center gap-[10px] border-t border-[#e9e2d8] px-[17px]">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Reply"
              className="h-full flex-1 bg-transparent text-[13px] text-[#2e221d] placeholder:text-[#2e221d]/50 outline-none"
            />

            <button
              type="button"
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
  const { user } = useAdmin();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [allMessages, setAllMessages] = useState([]);
  // Whether there are more messages beyond the dashboard's 5-message
  // preview — comes straight from the API (`hasMoreMessages`) rather than
  // being inferred from `allMessages.length`, since that's always capped
  // at 5 until "Read more" is actually clicked.
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [unreadIds, setUnreadIds] = useState(new Set());

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const result = await getDashboard();

        if (cancelled) {
          return;
        }

        setData(result);

        const dashboardMessages = Array.isArray(result?.recentMessages)
          ? result.recentMessages
          : [];

        setAllMessages(dashboardMessages);
        setHasMoreMessages(
          result?.hasMoreMessages !== undefined
            ? Boolean(result.hasMoreMessages)
            : dashboardMessages.length >= MESSAGES_PAGE_SIZE
        );

        setNotifications(
          Array.isArray(result?.notifications) &&
            result.notifications.length > 0
            ? result.notifications
            : import.meta.env.DEV
              ? FALLBACK_NOTIFICATIONS
              : []
        );

        setUnreadIds(
          new Set(
            dashboardMessages
              .filter((message) => message.read !== true)
              .map((message) => message.id)
          )
        );
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedMessages = useMemo(() => {
    return [...allMessages].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [allMessages]);

  const visibleMessages = showAllMessages
    ? sortedMessages
    : sortedMessages.slice(0, MESSAGES_PAGE_SIZE);

  async function handleReadMore() {
    if (loadingMoreMessages) {
      return;
    }

    setLoadingMoreMessages(true);
    setMessagesError("");

    try {
      const result = await getMessages();

      let fetchedMessages = [];

      if (Array.isArray(result)) {
        fetchedMessages = result;
      } else if (Array.isArray(result?.messages)) {
        fetchedMessages = result.messages;
      } else if (Array.isArray(result?.data)) {
        fetchedMessages = result.data;
      }

      if (fetchedMessages.length > 0) {
        setAllMessages(fetchedMessages);

        setUnreadIds(
          new Set(
            fetchedMessages
              .filter((message) => message.read !== true)
              .map((message) => message.id)
          )
        );
      }

      setShowAllMessages(true);
    } catch (err) {
      console.error("Failed to load all messages:", err);

      setMessagesError(
        err.message || "Failed to load more messages"
      );
    } finally {
      setLoadingMoreMessages(false);
    }
  }

  function handleShowLess() {
    setShowAllMessages(false);
  }

  function resolveNotification(id) {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }

  function openMessage(message) {
    setSelectedMessage(message);

    if (unreadIds.has(message.id)) {
      setUnreadIds((prev) => {
        const next = new Set(prev);
        next.delete(message.id);
        return next;
      });

      setAllMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, read: true, status: "READ" } : msg
        )
      );

      updateMessageStatus(message.id, "READ").catch((err) => {
        console.error("Failed to mark message as read:", err);
      });
    }
  }

  function handleMessageSent(id) {
    setUnreadIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    setAllMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, read: true, status: "REPLIED" } : msg
      )
    );
  }

  if (loading) {
    return (
      <AdminLayout
        title="Dashboard"
        subtitle="Loading..."
      >
        <div className="text-[#7c6c67]">
          Loading...
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="text-rose">
          {error}
        </div>
      </AdminLayout>
    );
  }

  const { kpis } = data || {};

  return (
    <AdminLayout
      title={`Hey ${user?.name?.split(" ")[0] || "there"}`}
      subtitle={`${user?.role || "Store Manager"} • Brew & Co.`}
      notifications={notifications}
      onResolveNotification={resolveNotification}
    >
      <div
        style={{ fontFamily: "'Geist', sans-serif" }}
        className="flex w-full flex-col gap-[24px] lg:gap-[33px]"
      >
        <div className="grid grid-cols-2 gap-[12px] lg:gap-[20px]">
          <KpiCard
            title="Reservations"
            value={`${kpis?.activeReservations ?? 0} tables`}
            delta={kpis?.reservationsDelta}
            deltaTone={
              kpis?.reservationsDelta?.startsWith("-")
                ? "negative"
                : "positive"
            }
            footerLabel="from yesterday"
            icon={Calendar}
          />

          <KpiCard
            title="Top Seller"
            value={kpis?.popularItem || "N/A"}
            delta={
              kpis?.popularItemSold
                ? `${kpis.popularItemSold} sold`
                : null
            }
            deltaTone="positive"
            footerLabel="today"
            icon={Coffee}
          />
        </div>

        <div className="overflow-hidden rounded-[16px] border border-transparent lg:border-[#e9e2d8] bg-white lg:shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)]">
          <div className="flex h-auto lg:h-[58px] items-center justify-between border-b border-[#e9e2d8] px-[16px] lg:px-[24px] py-[16px] lg:py-[20px]">
            <h2 className="font-display font-bold text-[18px] lg:text-[16px] text-[#2e221d]">
              Messages
            </h2>

            <span className="border border-[#e9e2d8] rounded-full px-[14px] py-[5px] text-[12px] font-medium text-[#2e221d]">
              All
            </span>
          </div>

          <div className="divide-y divide-[#e9e2d8] px-[16px] lg:px-[24px]">
            {visibleMessages.length > 0 ? (
              visibleMessages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => openMessage(message)}
                  className="flex h-auto min-h-[61px] w-full items-center gap-[12px] py-[16px] lg:py-[12px] text-left"
                >
                  <div
                    className={`size-[8px] rounded-full shrink-0 ${
                      unreadIds.has(message.id)
                        ? "bg-[#b55b3e]"
                        : "bg-transparent border border-[#e9e2d8]"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[14px] text-[#2e221d] truncate ${
                        unreadIds.has(message.id)
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {message.fullName}
                    </p>

                    <p className="text-[13px] text-[#7c6c67] truncate">
                      {message.message}
                    </p>
                  </div>

                  <span className="text-[12px] text-[#7c6c67] whitespace-nowrap shrink-0 ml-2">
                    {formatRelativeTime(message.createdAt)}
                  </span>
                </button>
              ))
            ) : (
              <div className="py-[32px] text-center text-[#7c6c67]">
                No new messages
              </div>
            )}
          </div>

          {/* "Read more" now depends on the API's hasMoreMessages flag,
              not on how many messages happen to be loaded locally — the
              dashboard preview is always capped at 5, so length-based
              checks could never trigger this. */}
          {hasMoreMessages && !showAllMessages && (
            <div className="border-t border-[#e9e2d8] py-[14px] text-center">
              <button
                type="button"
                onClick={handleReadMore}
                disabled={loadingMoreMessages}
                className="inline-flex items-center justify-center gap-[6px] text-[12px] font-bold uppercase tracking-wide text-[#b55b3e] disabled:opacity-50"
              >
                {loadingMoreMessages ? "Loading..." : "Read more"}

                {!loadingMoreMessages && (
                  <span aria-hidden="true">→</span>
                )}
              </button>

              {messagesError && (
                <p className="mt-[6px] text-[12px] text-[#b53e3e]">
                  {messagesError}
                </p>
              )}
            </div>
          )}

          {showAllMessages && sortedMessages.length > MESSAGES_PAGE_SIZE && (
            <div className="border-t border-[#e9e2d8] py-[14px] text-center">
              <button
                type="button"
                onClick={handleShowLess}
                className="inline-flex items-center justify-center gap-[6px] text-[12px] font-bold uppercase tracking-wide text-[#b55b3e]"
              >
                Show less
                <span aria-hidden="true">↑</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <MessageReplyModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onSent={handleMessageSent}
      />
    </AdminLayout>
  );
}