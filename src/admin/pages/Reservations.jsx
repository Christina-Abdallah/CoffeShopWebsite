import { useEffect, useState } from "react";
import { Calendar, Armchair, Check } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getAdminReservations } from "../api";

const TOTAL_TABLES = 20;

const ranges = ["Day", "Month", "Year"];

function isSameDay(dateStr, ref) {
  const d = new Date(dateStr);

  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function isSameMonth(dateStr, ref) {
  const d = new Date(dateStr);

  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth()
  );
}

function isSameYear(dateStr, ref) {
  const d = new Date(dateStr);

  return d.getFullYear() === ref.getFullYear();
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

function StatCard({
  label,
  value,
  footer,
  icon: Icon,
  valueColor = "#2e221d",
  withIconBg = true,
}) {
  return (
    <div className="bg-white rounded-[16px] p-[20px] border border-[#e9e2d8] shadow-[0px_4px_6px_0px_rgba(46,34,29,0.02)] flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#7c6c67]">
          {label}
        </p>

        {withIconBg ? (
          <div className="bg-[#fbf1ed] rounded-[8px] size-[32px] flex items-center justify-center shrink-0">
            <Icon size={16} className="text-[#b55b3e]" />
          </div>
        ) : (
          <Icon size={16} className="text-[#b55b3e] shrink-0" />
        )}
      </div>

      <p
        className="font-display font-bold text-[28px] leading-none"
        style={{ color: valueColor }}
      >
        {value}
      </p>

      <p className="text-[11px] text-[#7c6c67]">
        {footer}
      </p>
    </div>
  );
}

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("Day");

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

  const matchesRange = (reservation) => {
    if (range === "Day") {
      return isSameDay(reservation.date, today);
    }

    if (range === "Month") {
      return isSameMonth(reservation.date, today);
    }

    return isSameYear(reservation.date, today);
  };

  // Kept in the order the API returns them (matches the design, which
  // is not sorted chronologically — it reflects booking/creation order).
  const visible = reservations.filter(matchesRange);

  /*
   * Figma:
   * - Total Bookings Today
   * - Tables Occupied
   * - Available Tables
   *
   * The backend does not currently have physical
   * table numbers in the reservation model.
   *
   * For now, the number of today's reservations
   * is used as an approximation of occupied tables.
   */

  const bookingsToday = reservations.filter((reservation) =>
    isSameDay(reservation.date, today)
  ).length;

  const tablesOccupied = Math.min(
    bookingsToday,
    TOTAL_TABLES
  );

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
    >
      <div
        style={{ fontFamily: "'Geist', sans-serif" }}
        className="flex flex-col gap-[20px]"
      >

        {/* =========================
            STATISTICS
        ========================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
          <StatCard
            label="Total Bookings Today"
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
            label="Available Tables"
            value={`${availableTables} tables`}
            footer="ready to book"
            icon={Check}
            valueColor="#152e20"
          />
        </div>

        {/* =========================
            DAY / MONTH / YEAR FILTER
        ========================== */}

        <div className="flex justify-end">
          <div className="bg-white border border-[#e9e2d8] rounded-full flex items-center p-[3px]">
            {ranges.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={`px-[16px] py-[6px] rounded-full text-[12px] font-medium transition ${
                  range === item
                    ? "bg-[#152e20] text-white"
                    : "text-[#2e221d] hover:bg-[#f7f4f0]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* =========================
            RESERVATIONS TABLE
        ========================== */}

        <div className="bg-white border border-[#e9e2d8] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(46,34,29,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#e9e2d8]">
                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Table
                  </th>

                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Guest Name
                  </th>

                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Party Size
                  </th>

                  <th className="px-[24px] py-[16px] text-[13px] font-semibold text-[#7c6c67]">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-[#7c6c67]"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-[#7c6c67]"
                    >
                      No reservations for this period
                    </td>
                  </tr>
                ) : (
                  visible.map((reservation, index) => (
                    <tr
                      key={reservation.id}
                      className="border-b border-[#e9e2d8] last:border-0 hover:bg-[#f7f4f0]/50"
                    >
                      <td className="px-[24px] py-[16px] text-[14px] font-semibold text-[#2e221d]">
                        Table {reservation.tableNumber ?? index + 1}
                      </td>

                      <td className="px-[24px] py-[16px] text-[14px] font-medium text-[#2e221d]">
                        {reservation.name}
                      </td>

                      <td className="px-[24px] py-[16px] text-[14px] text-[#7c6c67]">
                        {reservation.guests} guests
                      </td>

                      <td className="px-[24px] py-[16px] text-[14px] text-[#7c6c67]">
                        {reservation.time}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}