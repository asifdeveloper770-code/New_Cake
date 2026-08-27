import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { flavors } from "@/content/site";
import { defaultMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CakeCard } from "@/components/CakeCard";
import { supabase } from "@/lib/supabase";

type SupabaseCake = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  tag: string | null;
  size: string | null;
  active: boolean;
};

export const Route = createFileRoute("/cakes")({
  head: () => ({
    meta: [
      {
        title: "Cakes & Flavors | Birthday & Celebration Cakes Miami Beach",
      },
      {
        name: "description",
        content:
          "Browse our Miami Beach cake collection: dulce de leche, chocolate, Nutella, guava, whipped cream and fresh fruit fillings. Ask about any cake on WhatsApp.",
      },
      {
        property: "og:title",
        content: "Cakes & Flavors | N.Y Nova Cake Studio",
      },
      {
        property: "og:description",
        content:
          "Custom birthday and celebration cakes in Miami Beach, with six signature fillings.",
      },
      {
        property: "og:url",
        content: "/cakes",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/cakes",
      },
    ],
  }),

  component: CakesPage,
});

function CakesPage() {
  const [cakes, setCakes] = useState<SupabaseCake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCakes() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          price,
          image_url,
          tag,
          size,
          active
        `)
        .eq("active", true)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Failed to load cakes:", error);
        setError("Unable to load our cake collection.");
        setLoading(false);
        return;
      }

      setCakes((data as SupabaseCake[]) || []);
      setLoading(false);
    }

    loadCakes();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-5 pb-12 pt-14 text-center sm:px-8 md:pt-20">
        <p className="eyebrow">The Collection</p>

        <h1 className="mt-5 font-display text-5xl leading-tight sm:text-6xl">
          Cakes &amp; Flavors
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Each cake below can be resized, restyled and refilled to suit your
          celebration. Tap any cake to ask about it directly on WhatsApp.
        </p>

        {/* Order Notice */}
        <div className="mx-auto mt-7 max-w-xl rounded-xl border border-border bg-secondary/40 px-5 py-4">
          <p className="font-display text-base font-medium text-foreground">
            Please note
          </p>

          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Orders should be placed at least{" "}
            <span className="font-medium text-foreground">
              3 days in advance
            </span>
            . Rush orders may be accommodated depending on availability.
          </p>
        </div>
      </section>

      {/* Cake Gallery */}
      <section
        aria-label="Cake gallery"
        className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"
      >
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />

              <p className="mt-4 text-sm text-muted-foreground">
                Loading our cakes...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-secondary/30 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 text-sm font-medium underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : cakes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-secondary/30 px-6 py-12 text-center">
            <h2 className="font-display text-2xl">
              Our collection is being refreshed
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Please check back soon or contact us directly on WhatsApp.
            </p>

            <div className="mt-6 flex justify-center">
              <WhatsAppButton message={defaultMessage} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {cakes.map((cake) => (
              <div key={cake.id} className="min-w-0">
                <CakeCard
                  cake={{
                    slug: cake.slug,
                    name: cake.name,
                    description:
                      cake.description || "",
                    filling: cake.tag || "",
                    occasion: cake.size || "",
                    image:
                      cake.image_url || "",
                    alt: cake.name,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Flavors */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <p className="eyebrow">Available Fillings</p>

          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Six fillings, endlessly combined
          </h2>

          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {flavors.map((f) => (
              <li
                key={f.name}
                className="border-b border-border pb-5"
              >
                <p className="font-display text-2xl">
                  {f.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {f.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 md:py-20">
        <h2 className="font-display text-3xl sm:text-4xl">
          Have something else in mind?
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Send us a photo or an idea — most of our cakes start as a message.
        </p>

        <div className="mt-8 flex justify-center">
          <WhatsAppButton message={defaultMessage} />
        </div>
      </section>
    </>
  );
}
