import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { business } from "@/content/site";
import { defaultMessage, waLink } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Cake Orders | N.Y Nova Cake Studio Miami Beach" },
      {
        name: "description",
        content:
          "Order a custom cake in Miami Beach. Message N.Y Nova Cake Studio on WhatsApp, call 305-540-7329 or send an inquiry.",
      },
      { property: "og:title", content: "Contact | N.Y Nova Cake Studio" },
      {
        property: "og:description",
        content:
          "WhatsApp, call or email N.Y Nova Cake Studio to order a custom cake in Miami Beach.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    guests: "",
    flavor: "",
    details: "",
  });

  const message = `Hi ${business.name}, I'd like to order a cake.
Name: ${form.name || "-"}
Event date: ${form.date || "-"}
Servings: ${form.guests || "-"}
Preferred flavour: ${form.flavor || "-"}
Details: ${form.details || "-"}`;

  const field =
    "mt-2 w-full rounded-sm border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none";

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-14 text-center sm:px-8 md:pt-20">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-5 font-display text-5xl leading-tight sm:text-6xl">
          Order your cake
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          WhatsApp is the fastest way to reach us. Send your date, servings and
          flavour and we'll reply with designs and pricing.
        </p>
        <div className="mt-8 flex justify-center">
          <WhatsAppButton message={defaultMessage} />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 md:grid-cols-2 md:py-16">
        <div>
          <h2 className="font-display text-3xl">Studio details</h2>
          <ul className="mt-8 space-y-6 text-sm">
            <li className="flex gap-4">
              <Phone className="mt-0.5 size-5 text-gold" aria-hidden="true" />
              <div>
                <p className="eyebrow">Phone</p>
                <a
                  className="mt-1 block text-base hover:underline"
                  href={`tel:${business.phoneLink}`}
                >
                  {business.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-0.5 size-5 text-gold" aria-hidden="true" />
              <div>
                <p className="eyebrow">Email</p>
                <a
                  className="mt-1 block break-all text-base hover:underline"
                  href={`mailto:${business.email}`}
                >
                  {business.email}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-0.5 size-5 text-gold" aria-hidden="true" />
              <div>
                <p className="eyebrow">Service area</p>
                <p className="mt-1 text-base leading-relaxed text-muted-foreground">
                  {business.serviceArea}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-0.5 size-5 text-gold" aria-hidden="true" />
              <div>
                <p className="eyebrow">Hours</p>
                <p className="mt-1 text-base text-muted-foreground">
                  {business.hours}
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-10 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            <p className="text-foreground">How ordering works</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>Message us with your date, servings and flavour.</li>
              <li>We confirm design, pricing and pickup or delivery.</li>
              <li>A deposit secures your date — we bake fresh for it.</li>
            </ol>
          </div>
        </div>

        <div className="rounded-sm border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-3xl">Cake inquiry</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill this in and we'll open WhatsApp with your details ready to send.
          </p>
          <form
            className="mt-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(waLink(message), "_blank", "noopener,noreferrer");
            }}
          >
            <div>
              <label className="text-sm" htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                required
                className={field}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm" htmlFor="date">
                  Event date
                </label>
                <input
                  id="date"
                  type="date"
                  className={field}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm" htmlFor="guests">
                  Servings
                </label>
                <input
                  id="guests"
                  inputMode="numeric"
                  className={field}
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  placeholder="e.g. 20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm" htmlFor="flavor">
                Preferred filling
              </label>
              <input
                id="flavor"
                className={field}
                value={form.flavor}
                onChange={(e) => setForm({ ...form, flavor: e.target.value })}
                placeholder="Dulce de leche, guava, chocolate…"
              />
            </div>
            <div>
              <label className="text-sm" htmlFor="details">
                Tell us about your cake
              </label>
              <textarea
                id="details"
                rows={4}
                className={field}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Occasion, colours, inspiration, delivery area…"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-whatsapp px-7 text-sm text-whatsapp-foreground transition-all hover:brightness-95"
            >
              Send via WhatsApp
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
