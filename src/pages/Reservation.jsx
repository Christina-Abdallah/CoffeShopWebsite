import { useState } from "react";
import { CalendarCheck, Info, User, Calendar, Clock, Users } from "lucide-react";
import Reveal from "../components/Reveal";
import FormField from "../components/FormField";

const OPEN_HOUR = 7; // 7:00 AM
const CLOSE_HOUR = 21; // last seating 9:00 PM

const initialForm = { name: "", date: "", time: "", guests: "2" };

function todayISO() {
  return new Date().toISOString().split("T")[0];
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setConfirmed({ ...values });
      setValues(initialForm);
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
        <h1 className="font-display text-3xl font-bold sm:text-4xl text-stone-900 dark:text-cream">
          Reserve a Table
        </h1>
        <p className="mt-2 text-stone-800 font-medium dark:text-cream-soft/60">
          Book your spot and enjoy our cozy atmosphere.
        </p>

        {confirmed && (
          <div className="mt-5 flex items-start gap-2 rounded-lg bg-forest/10 px-4 py-3 text-sm text-forest dark:bg-clay/10 dark:text-clay-light">
            <CalendarCheck size={18} className="mt-0.5 shrink-0" />
            <span>
              Thanks, {confirmed.name}! Your table for {confirmed.guests} on {confirmed.date} at{" "}
              {confirmed.time} is reserved.
            </span>
          </div>
        )}

        {/* Formulaire en largeur maximale 100% */}
        <form className="mt-6 w-full space-y-4 rounded-xl2 bg-white p-6 shadow-soft dark:bg-forest-light" onSubmit={handleSubmit} noValidate>
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

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay-dark shadow-md"
          >
            Reserve Now <CalendarCheck size={16} />
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-medium text-stone-900 border border-stone-900/10 dark:bg-forest-deep dark:text-cream-soft/75 dark:border-transparent">
          <Info size={16} className="mt-0.5 shrink-0 text-clay" />
          Please arrive 10 minutes early. We can&apos;t wait to serve you!
        </div>
      </Reveal>
    </section>
  );
}