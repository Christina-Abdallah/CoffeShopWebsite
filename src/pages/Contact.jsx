import { useState } from "react";
import { MapPin, Clock, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import Reveal from "../components/Reveal";
import FormField from "../components/FormField";

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

const initialForm = { name: "", email: "", subject: "", message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.subject.trim()) errors.subject = "Please add a subject.";
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
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
      setValues(initialForm);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <Reveal>
        {/* Titre principal bien foncé */}
        <h1 className="font-display text-3xl font-bold sm:text-4xl text-stone-900 dark:text-cream">
          Contact Us
        </h1>
        {/* Sous-titre bien foncé */}
        <p className="mt-2 text-stone-800 font-medium dark:text-cream-soft/60">
          We&apos;d love to hear from you!
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr_360px]">
        {/* Info cards */}
        <Reveal delay={100} className="space-y-4">
          {infoCards.map(({ icon: Icon, color, title, lines }) => (
            <div key={title} className="flex gap-3 rounded-xl2 bg-white p-4 shadow-soft dark:bg-forest-light">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-white`}>
                <Icon size={18} />
              </span>
              <div>
                <p className="font-semibold text-stone-900 dark:text-cream">{title}</p>
                {lines.map((line) => (
                  <p key={line} className="text-sm font-medium text-stone-700 dark:text-cream-soft/70">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        {/* Map placeholder */}
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
              <MapPin size={40} className="fill-clay text-forest drop-shadow" />
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

            {submitted && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-forest/10 px-3 py-2 text-sm font-medium text-forest dark:bg-clay/10 dark:text-clay-light">
                <CheckCircle2 size={16} />
                Message sent! We&apos;ll get back to you soon.
              </div>
            )}

            <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
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
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest-light dark:bg-clay dark:hover:bg-clay-dark shadow-md"
              >
                Send Message <Send size={15} />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}