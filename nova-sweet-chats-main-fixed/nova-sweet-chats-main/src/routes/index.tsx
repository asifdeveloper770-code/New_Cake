import { createFileRoute, Link } from "@tanstack/react-router";
import heroCake from "@/assets/hero-cake.jpg";
import { business, cakes, flavors, occasions, whyUs } from "@/content/site";
import { defaultMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CakeCard } from "@/components/CakeCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Custom Cakes in Miami Beach | N.Y Nova Cake Studio" },
      {
        name: "description",
        content:
          "Elegant custom birthday and celebration cakes in Miami Beach. Dulce de leche, Nutella, guava and more — order in seconds via WhatsApp.",
      },
      {
        property: "og:title",
        content: "Custom Cakes in Miami Beach | N.Y Nova Cake Studio",
      },
      {
        property: "og:description",
        content:
          "Boutique celebration cakes handcrafted in Miami Beach. Order via WhatsApp.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const byslug = (slug: string) => cakes.find((c) => c.slug === slug)!;

const occasionCards = [
  {
    title: "Birthdays",
    copy: occasions[0]?.copy ?? "",
    image: byslug("pastel-birthday").image,
    alt: byslug("pastel-birthday").alt,
  },
  {
    title: "Celebrations",
    copy: "Engagements, weddings and milestones, styled with restraint.",
    image: byslug("gold-leaf-signature").image,
    alt: byslug("gold-leaf-signature").alt,
  },
  {
    title: "Special Occasions",
    copy: "Showers, corporate events and any excuse for something sweet.",
    image: byslug("fresh-fruit").image,
    alt: byslug("fresh-fruit").alt,
  },
];

function Home() {
  const featured = cakes.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate">
        <img
          src={heroCake}
          alt="Ivory buttercream celebration cake with gold leaf and fresh flowers on a marble stand"
          width={1408}
          height={1760}
          fetchPriority="high"
          decoding="async"
          className="h-[78vh] min-h-[520px] w-full object-cover md:h-[88vh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/35 to-primary/10 md:bg-gradient-to-r md:from-primary/85 md:via-primary/35 md:to-transparent" />
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="reveal mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8 md:pb-0">
            <p className="eyebrow text-primary-foreground/70">
              Miami Beach · Boutique Cake Studio
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[1.03] text-primary-foreground sm:text-6xl md:text-7xl">
              Beautiful Cakes Made for Life's Special Moments
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-primary-foreground/80">
              A boutique studio in Miami Beach crafting custom celebration cakes
              — designed with you, baked fresh for your date.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <WhatsAppButton message={defaultMessage} />
              <Link
                to="/cakes"
                className="inline-flex min-h-12 items-center rounded-full border border-primary-foreground/40 px-7 text-sm text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
              >
                Explore Our Cakes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 md:py-20">
          <p className="eyebrow">The Studio</p>
          <h2 className="mt-5 font-display text-3xl leading-snug sm:text-4xl">
            A small studio, an obsessive eye for detail.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Every N.Y Nova cake is baked to order in Miami Beach using real
            cream, real fruit and slow-cooked dulce de leche. No shortcuts, no
            catalogue templates — just cakes designed around your celebration.
          </p>
        </div>
      </section>

      {/* Featured cakes */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Signature cakes
            </h2>
          </div>
          <Link
            to="/cakes"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View the full collection
          </Link>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((cake) => (
            <CakeCard key={cake.slug} cake={cake} />
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <p className="eyebrow">Why N.Y Nova</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl">
            Why clients choose our studio
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {whyUs.map((item, i) => (
              <div key={item.title} className="border-t border-border pt-6">
                <span className="font-display text-2xl text-gold">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-lg font-normal">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flavors */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="max-w-xl">
          <p className="eyebrow">Fillings &amp; Flavours</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Choose your filling
          </h2>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {flavors.map((f, i) => (
            <li
              key={f.name}
              className="group bg-background p-8 transition-colors duration-500 hover:bg-secondary/60"
            >
              <span className="font-display text-lg text-gold">
                0{i + 1}
              </span>
              <p className="mt-4 font-display text-3xl leading-tight transition-transform duration-500 group-hover:translate-x-1">
                {f.name}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Occasions */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <p className="eyebrow">Special Occasions</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Cakes for every celebration
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {occasionCards.map((o, i) => (
              <Link
                key={o.title}
                to="/cakes"
                className={`group block ${i === 1 ? "md:mt-10" : ""}`}
              >
                <div className="relative overflow-hidden bg-secondary">
                  <img
                    src={o.image}
                    alt={o.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                  <h3 className="absolute inset-x-0 bottom-0 p-6 font-display text-3xl text-primary-foreground">
                    {o.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {o.copy}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 md:py-24">
        <p className="eyebrow">Service Area</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">
          Proudly serving Miami Beach
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {business.serviceArea} Pickup and local delivery available — tell us
          your date and we'll take care of the rest.
        </p>
      </section>

      {/* Final conversion */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Let's Create Something Sweet.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed opacity-80">
            Send us your date, guest count and the flavours you love. We'll
            reply with ideas, options and pricing.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <WhatsAppButton message={defaultMessage} />
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center rounded-full border border-primary-foreground/30 px-7 text-sm transition-colors hover:bg-primary-foreground hover:text-primary"
            >
              Other ways to reach us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
