import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Armchair, Check, Coffee, User } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getAdminReservations } from "../api";

const TOTAL_TABLES = 20;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(dateStr, ref) {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function daysInMonth(monthIndex, year) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// "Thursday, Oct 24, 2026" — matches the design's subtitle.
function formatLongDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatCard({ label, value, footer, icon: Icon, valueColor = "#2e221d" }) {
  return (
    <div className="bg-white rounded-[14px] p-[12px] sm:p-[20px] border border-[#e9e2d8] shadow-[0px_4px_6px_0px_rgba(46,34,29,0.02)] flex flex-col gap-[6px] sm:gap-[8px]">
      <div className="flex items-center justify-between gap-[6px]">
        <p className="text-[11px] sm:text-[13px] font-medium text-[#7c6c67] leading-tight">{label}</p>
        <div className="bg-[#fbf1ed] rounded-[8px] size-[24px] sm:size-[32px] flex items-center justify-center shrink-0">
          <Icon size={13} className="text-[#b55b3e]" />
        </div>
      </div>
      <p
        className="font-display font-bold text-[18px] sm:text-[28px] leading-none truncate"
        style={{ color: valueColor }}
      >
        {value}
      </p>
      <p className="text-[10px] sm:text-[11px] text-[#7c6c67] truncate">{footer}</p>
    </div>
  );
}

function GuestAvatar({ name, photoUrl }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="size-[40px] rounded-full object-cover shrink-0"
      />
    );
  }

  const initials = (name || "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="size-[40px] rounded-full bg-[#b55b3e]/15 flex items-center justify-center shrink-0">
      {initials ? (
        <span className="text-[13px] font-semibold text-[#b55b3e]">{initials}</span>
      ) : (
        <User size={16} className="text-[#b55b3e]" />
      )}
    </div>
  );
}

function ReservationCard({ reservation, index }) {
  return (
    <div className="bg-white rounded-[14px] border border-[#e9e2d8] p-[14px] flex flex-col gap-[12px] shadow-[0px_2px_6px_0px_rgba(46,34,29,0.02)]">
      <div className="flex items-center gap-[12px]">
        <GuestAvatar name={reservation.name} photoUrl={reservation.avatarUrl} />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#2e221d] truncate">
            {reservation.name}
          </p>
          <p className="text-[13px] text-[#7c6c67] truncate">
            {reservation.guests} guests • {reservation.time}
          </p>
        </div>
      </div>

      <div className="h-px bg-[#e9e2d8]" />

      <span className="inline-flex w-fit items-center gap-[6px] rounded-full bg-[#fbf1ed] px-[10px] py-[4px] text-[12px] font-medium text-[#b55b3e]">
        <Coffee size={12} />
        Table {reservation.tableNumber ?? index + 1}
      </span>
    </div>
  );
}

// --- iOS-style scrollable wheel column, used by the date picker sheet ---
const ITEM_H = 40;
const VISIBLE = 5;
const WHEEL_H = ITEM_H * VISIBLE;
const WHEEL_PAD = (WHEEL_H - ITEM_H) / 2;

function WheelColumn({ items, selectedIndex, onChange }) {
  const ref = useRef(null);
  const settleTimer = useRef(null);

  useEffect(() => {
    ref.current?.scrollTo({
      top: selectedIndex * ITEM_H,
      behavior: "auto",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (!ref.current) return;

    const idx = Math.round(ref.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));

    if (clamped !== selectedIndex) onChange(clamped);

    clearTimeout(settleTimer.current);

    settleTimer.current = setTimeout(() => {
      ref.current?.scrollTo({
        top: clamped * ITEM_H,
        behavior: "smooth",
      });
    }, 90);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="w-full no-scrollbar overflow-y-scroll snap-y snap-mandatory"
      style={{
        height: WHEEL_H,
        maxHeight: WHEEL_H,
        minHeight: WHEEL_H,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div style={{ height: WHEEL_PAD }} />

      {items.map((label, i) => {
        const distance = Math.abs(i - selectedIndex);

        return (
          <div
            key={i}
            className="snap-center flex items-center justify-center"
            style={{
              height: ITEM_H,
              fontSize:
                distance === 0 ? 20 : distance === 1 ? 15 : 13,
              fontWeight: distance === 0 ? 700 : 500,
              color:
                distance === 0
                  ? "#2e221d"
                  : distance === 1
                    ? "#a89f98"
                    : "#d8cfc7",
              transition: "color 120ms, font-size 120ms",
            }}
          >
            {label}
          </div>
        );
      })}

      <div style={{ height: WHEEL_PAD }} />
    </div>
  );
}

function TimelineDatePicker({ initialDate, onApply, onClose }) {
  const [dayIdx, setDayIdx] = useState(initialDate.getDate() - 1);
  const [monthIdx, setMonthIdx] = useState(initialDate.getMonth());

  const years = useMemo(() => {
    const start = new Date().getFullYear() - 2;
    return Array.from({ length: 8 }, (_, i) => start + i);
  }, []);

  const [yearIdx, setYearIdx] = useState(() => {
    const y = years.indexOf(initialDate.getFullYear());
    return y >= 0 ? y : 0;
  });

  const year = years[yearIdx];
  const dayCount = daysInMonth(monthIdx, year);

  const days = useMemo(
    () => Array.from({ length: dayCount }, (_, i) => i + 1),
    [dayCount]
  );

  const handleApply = () => {
    const clampedDay = Math.min(dayIdx + 1, dayCount);
    onApply(new Date(year, monthIdx, clampedDay));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[70]"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 right-0 z-[80] rounded-t-[20px] bg-white p-[16px] pb-[24px]">
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

        <div className="mx-auto mb-[12px] h-[4px] w-[40px] rounded-full bg-[#e9e2d8]" />

        <div className="flex items-center justify-between mb-[8px]">
          <h3 className="font-display font-bold text-[16px] text-[#2e221d]">
            Select Date
          </h3>

          <button
            onClick={onClose}
            className="text-[13px] text-[#7c6c67] hover:text-[#2e221d]"
          >
            Cancel
          </button>
        </div>

        <div className="flex items-stretch border-y border-[#e9e2d8] overflow-hidden">
          <div className="flex-1 flex flex-col items-center pt-[6px] pb-[2px]">
            <span className="text-[11px] font-semibold text-[#7c6c67]">
              D
            </span>

            <WheelColumn
              key={days.length}
              items={days}
              selectedIndex={Math.min(dayIdx, days.length - 1)}
              onChange={setDayIdx}
            />
          </div>

          <div className="w-px bg-[#e9e2d8]" />

          <div className="flex-[1.4] flex flex-col items-center pt-[6px] pb-[2px]">
            <span className="text-[11px] font-semibold text-[#7c6c67]">
              M
            </span>

            <WheelColumn
              items={MONTHS}
              selectedIndex={monthIdx}
              onChange={setMonthIdx}
            />
          </div>

          <div className="w-px bg-[#e9e2d8]" />

          <div className="flex-1 flex flex-col items-center pt-[6px] pb-[2px]">
            <span className="text-[11px] font-semibold text-[#7c6c67]">
              Y
            </span>

            <WheelColumn
              items={years}
              selectedIndex={yearIdx}
              onChange={setYearIdx}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="mt-[16px] h-[48px] w-full rounded-[8px] bg-[#b55b3e] text-white text-[15px] font-semibold hover:opacity-90 transition"
        >
          View Timeline
        </button>
      </div>
    </>
  );
}

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [pickerOpen, setPickerOpen] = useState(false);

  // Added only to make the Reservations search field editable.
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReservations() {
      try {
        const data = await getAdminReservations();

        if (!cancelled) {
          setReservations(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load reservations:", err);

        if (!cancelled) {
          setReservations([]);
          setLoading(false);
        }
      }
    }

    loadReservations();

    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date();
  const scheduleIsToday = isSameDay(scheduleDate, today);

  // Kept in the order the API returns them (matches the design, which
  // is not sorted chronologically — it reflects booking/creation order).
  const visible = reservations.filter((r) => isSameDay(r.date, scheduleDate));

  /*
   * Figma:
   * - Reservations (booked today)
   * - Tables Occupied
   * - Available
   *
   * The backend does not currently have physical table numbers in the
   * reservation model, so today's reservation count approximates occupancy.
   * These stat cards always reflect the real "today", independent of
   * whatever date is picked in the timeline sheet below.
   */
  const bookingsToday = reservations.filter(
    (r) => isSameDay(r.date, today)
  ).length;

  const tablesOccupied = Math.min(bookingsToday, TOTAL_TABLES);
  const availableTables = Math.max(
    TOTAL_TABLES - tablesOccupied,
    0
  );
  const capacityPct = Math.round(
    (tablesOccupied / TOTAL_TABLES) * 100
  );

  return (
    <AdminLayout
      title="Reservations"
      subtitle={formatLongDate(today)}
      search={search}
      onSearchChange={setSearch}
    >
      <div
        style={{ fontFamily: "'Geist', sans-serif" }}
        className="flex flex-col gap-[20px]"
      >

        {/* =========================
            STATISTICS — always 3 across, even on mobile
        ========================== */}
        <div className="grid grid-cols-3 gap-[10px] sm:gap-[20px]">
          <StatCard
            label="Reservations"
            value={`${bookingsToday} tables`}
            footer="booked today"
            icon={Calendar}
          />

          <StatCard
            label="Tables Occupied"
            value={`${tablesOccupied} / ${TOTAL_TABLES}`}
            footer={`${capacityPct}% current capacity`}
            icon={Armchair}
            valueColor="#b55b3e"
          />

          <StatCard
            label="Available"
            value={`${availableTables} tables`}
            footer="ready to book"
            icon={Check}
            valueColor="#152e20"
          />
        </div>

        {/* =========================
            TODAY'S SCHEDULE — card list, "View Timeline" opens the date picker
        ========================== */}
        <div className="flex flex-col gap-[14px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-[18px] text-[#2e221d]">
              {scheduleIsToday
                ? "Today's Schedule"
                : `Schedule — ${scheduleDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`}
            </h2>

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-[13px] font-semibold text-[#b55b3e] hover:opacity-80"
            >
              View Timeline
            </button>
          </div>

          <div className="flex flex-col gap-[12px]">
            {loading ? (
              <div className="p-8 text-center text-[#7c6c67]">
                Loading...
              </div>
            ) : visible.length === 0 ? (
              <div className="p-8 text-center text-[#7c6c67]">
                No reservations for this day
              </div>
            ) : (
              visible.map((reservation, index) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {pickerOpen && (
        <TimelineDatePicker
          initialDate={scheduleDate}
          onClose={() => setPickerOpen(false)}
          onApply={(date) => {
            setScheduleDate(date);
            setPickerOpen(false);
          }}
        />
      )}
    </AdminLayout>
  );
}