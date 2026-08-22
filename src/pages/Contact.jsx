import { useState } from "react";
import { MapPin, Clock, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import Reveal from "../components/Reveal";
import FormField from "../components/FormField";
import { createContactMessage } from "../utils/api";
const infoCards = [
  {
    icon: MapPin,
    color: "bg-forest",
    title: "Visit Us",
    lines: ["123 Coffee Lane", "Brewville, CA 90210"],
  },
  {
    icon: Clock,
    color: "bg-clay",
    title: "Opening Hours",
    lines: ["Mon – Fri: 7:00 AM – 8:00 PM", "Sat – Sun: 8:00 AM – 9:00 PM"],
  },
  {
    icon: Phone,
    color: "bg-blue-500",
    title: "Call Us",
    lines: ["(555) 123-BREW"],
  },
  {
    icon: Mail,
    color: "bg-purple-500",
    title: "Email Us",
    lines: ["hello@brewandco.com"],
  },
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Please add a subject.";
  } else if (values.subject.trim().length < 3) {
    errors.subject = "Subject should be at least 3 characters.";
  }

  if (!values.message.trim()) {
    errors.message = "Please write a message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // API states
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((v) => ({
      ...v,
      [name]: value,
    }));

    // Remove field error when user starts correcting it
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

    // Remove success message when user starts a new message
    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset API states
    setApiError(null);
    setSubmitted(false);

    // Frontend validation
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await createContactMessage({
        fullName: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });

      // Success
      setSubmitted(true);

      // Clear form
      setValues(initialForm);
      setErrors({});
    } catch (err) {
      setApiError(
        err.message ||
          "We couldn't send your message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      {/* Header */}
      <Reveal>
        <h1 className="font-display text-3xl font-bold sm:text-4xl text-stone-900 dark:text-cream">
          Contact Us
        </h1>

        <p className="mt-2 text-stone-800 font-medium dark:text-cream-soft/60">
          We&apos;d love to hear from you!
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr_360px]">
        {/* Information cards */}
        <Reveal delay={100} className="space-y-4">
          {infoCards.map(({ icon: Icon, color, title, lines }) => (
            <div
              key={title}
              className="flex gap-3 rounded-xl2 bg-white p-4 shadow-soft dark:bg-forest-light"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-white`}
              >
                <Icon size={18} />
              </span>

              <div>
                <p className="font-semibold text-stone-900 dark:text-cream">
                  {title}
                </p>

                {lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm font-medium text-stone-700 dark:text-cream-soft/70"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        {/* Map */}
        <Reveal delay={200}>
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-xl2 bg-cream-soft shadow-soft dark:bg-forest-light">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(31,61,42,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(31,61,42,0.08) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
              aria-hidden="true"
            />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <MapPin
                size={40}
                className="fill-clay text-forest drop-shadow"
              />
            </div>

            <span className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-stone-800 dark:bg-forest-deep/90 dark:text-cream-soft/70">
              Map placeholder — embed your live map here
            </span>
          </div>
        </Reveal>

        {/* Contact form */}
        <Reveal delay={300}>
          <div className="rounded-xl2 bg-white p-6 shadow-soft dark:bg-forest-light">
            <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-cream">
              Send Us a Message
            </h2>

            {/* SUCCESS MESSAGE */}
            {submitted && (
              <div className="mt-4 rounded-xl border border-forest/20 bg-forest/5 p-4 dark:border-clay/30 dark:bg-clay/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-white dark:bg-clay">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-stone-900 dark:text-cream">
                      Message Sent Successfully
                    </p>

                    <p className="mt-1 text-sm text-stone-700 dark:text-cream-soft/70">
                      Thank you for contacting Brew &amp; Co. We&apos;ll get
                      back to you as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* API ERROR */}
            {apiError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-300">
                {apiError}
              </div>
            )}

            <form
              className="mt-5 space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <FormField
                label="Your Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Jane Doe"
              />

              <FormField
                label="Your Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="jane@example.com"
              />

              <FormField
                label="Subject"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                error={errors.subject}
                placeholder="Catering inquiry"
              />

              <FormField
                label="Your Message"
                name="message"
                as="textarea"
                value={values.message}
                onChange={handleChange}
                error={errors.message}
                placeholder="Tell us how we can help..."
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream shadow-md transition-colors hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-50 dark:bg-clay dark:hover:bg-clay-dark"
              >
                {loading ? "Sending..." : "Send Message"}

                {!loading && <Send size={15} />}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}