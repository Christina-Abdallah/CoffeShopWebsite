import { useState } from "react";
import { CalendarCheck, Info, User, Calendar, Clock, Users } from "lucide-react";
import Reveal from "../components/Reveal";
import FormField from "../components/FormField";
import { createReservation } from "../utils/api";
const OPEN_HOUR = 7; // 7:00 AM
const CLOSE_HOUR = 21; // last seating 9:00 PM

const initialForm = { name: "", date: "", time: "", guests: "2" };

function todayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";

  if (!values.date) {
    errors.date = "Please choose a date.";
  } else if (values.date < todayISO()) {
    errors.date = "Date can't be in the past.";
  }

  if (!values.time) {
    errors.time = "Please choose a time.";
  } else {
    const [hour] = values.time.split(":").map(Number);
    if (hour < OPEN_HOUR || hour >= CLOSE_HOUR) {
      errors.time = `We're open ${OPEN_HOUR}:00 AM–${CLOSE_HOUR - 12}:00 PM. Pick a time in range.`;
    }
  }

  const guests = Number(values.guests);
  if (!values.guests || Number.isNaN(guests)) {
    errors.guests = "Enter number of guests.";
  } else if (guests < 1) {
    errors.guests = "At least 1 guest is required.";
  } else if (guests > 12) {
    errors.guests = "For groups over 12, please call us directly.";
  }

  return errors;
}
export default function Reservation() {
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);

  // API states
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((v) => ({
      ...v,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Remove API error when user modifies the form
    if (apiError) {
      setApiError(null);
    }

    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset API states
    setApiError(null);
    setSuccess(false);

    // Frontend validation
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // Send reservation to Express backend
      const response = await createReservation({
        name: values.name,
        date: values.date,
        time: values.time,
        guests: Number(values.guests),
      });

      console.log("Reservation API response:", response);

      // Reservation successfully created
      setConfirmed({
        name: values.name,
        date: values.date,
        time: values.time,
        guests: values.guests,
      });

      setSuccess(true);

      // Reset form
      setValues(initialForm);
      setErrors({});
    } catch (err) {
      console.error("Reservation error:", err);

      setApiError(
        err.message || "Unable to create the reservation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-2 lg:items-center">
    <Reveal>
      <img
        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"
        alt="Cozy cafe interior with wooden table and green chairs"
        className="aspect-[4/3] w-full rounded-xl2 object-cover shadow-soft"
      />
    </Reveal>

    <Reveal delay={150} className="w-full">
      <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-cream sm:text-4xl">
        Reserve a Table
      </h1>

      <p className="mt-2 font-medium text-stone-800 dark:text-cream-soft/60">
        Book your spot and enjoy our cozy atmosphere.
      </p>

      {/* Successful reservation */}
      {confirmed && success && (
        <div className="mt-5 rounded-xl2 border border-forest/20 bg-forest/5 p-5 shadow-sm dark:border-clay/30 dark:bg-clay/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-white dark:bg-clay">
              <CalendarCheck size={20} />
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-stone-900 dark:text-cream">
                Reservation Confirmed!
              </h2>

              <p className="mt-1 text-sm font-medium text-stone-800 dark:text-cream-soft">
                Thank you, {confirmed.name}! Your table has been successfully
                reserved.
              </p>
            </div>
          </div>

          {/* Reservation details */}
          <div className="mt-4 grid gap-3 rounded-lg border border-stone-900/10 bg-white p-4 text-sm dark:border-transparent dark:bg-forest-deep/60 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-cream-soft/50">
                Date
              </p>

              <p className="mt-1 font-bold text-stone-900 dark:text-cream">
                {confirmed.date}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-cream-soft/50">
                Time
              </p>

              <p className="mt-1 font-bold text-stone-900 dark:text-cream">
                {confirmed.time}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-cream-soft/50">
                Guests
              </p>

              <p className="mt-1 font-bold text-stone-900 dark:text-cream">
                {confirmed.guests}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-stone-900 dark:text-cream">
            We look forward to welcoming you at Brew &amp; Co.!
          </p>
        </div>
      )}

      {/* API error */}
      {apiError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {apiError}
        </div>
      )}

      {/* Form */}
      <form
        className="mt-6 w-full space-y-4 rounded-xl2 bg-white p-6 shadow-soft dark:bg-forest-light"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="w-full">
          <FormField
            label="Full Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter your full name"
            icon={<User size={16} />}
          />
        </div>

        <div className="w-full">
          <FormField
            label="Date"
            name="date"
            type="date"
            value={values.date}
            onChange={handleChange}
            error={errors.date}
            min={todayISO()}
            icon={<Calendar size={16} />}
          />
        </div>

        <div className="w-full">
          <FormField
            label="Time"
            name="time"
            type="time"
            value={values.time}
            onChange={handleChange}
            error={errors.time}
            icon={<Clock size={16} />}
          />
        </div>

        <div className="w-full">
          <FormField
            label="Number of Guests"
            name="guests"
            as="select"
            value={values.guests}
            onChange={handleChange}
            error={errors.guests}
            icon={<Users size={16} />}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </FormField>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-clay-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Reserve Now"}

          {!loading && <CalendarCheck size={16} />}
        </button>
      </form>

      {/* Information */}
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-stone-900/10 bg-white/80 px-4 py-3 text-sm font-semibold text-stone-900 shadow-sm backdrop-blur-sm dark:border-transparent dark:bg-forest-deep dark:text-cream-soft">
        <Info
          size={16}
          className="mt-0.5 shrink-0 text-clay"
        />

        <span>
          Please arrive 10 minutes early. We can&apos;t wait to serve you!
        </span>
      </div>
    </Reveal>
  </section>
);
}