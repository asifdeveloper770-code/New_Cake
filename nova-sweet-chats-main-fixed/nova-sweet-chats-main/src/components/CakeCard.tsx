import type { Cake } from "@/content/site";
import { cakeMessage, waLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export function CakeCard({ cake }: { cake: Cake }) {
  return (
    <article className="group flex flex-col">
      <a
        href={waLink(cakeMessage(cake.name))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ask about ${cake.name} on WhatsApp`}
        className="relative block overflow-hidden bg-secondary"
      >
        <img
          src={cake.image}
          alt={cake.alt}
          width={1000}
          height={1250}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/80 via-primary/10 to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="font-display text-3xl text-primary-foreground">
            {cake.name}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/85">
            <MessageCircle className="size-4" aria-hidden="true" />
            Ask About This Cake
          </span>
        </div>
      </a>
      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow">{cake.occasion}</p>
        <h3 className="mt-2 font-display text-2xl">{cake.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {cake.description}
        </p>
        <p className="mt-3 text-sm text-foreground/80">
          <span className="text-muted-foreground">Filling · </span>
          {cake.filling}
        </p>
        <a
          href={waLink(cakeMessage(cake.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-2 border-b border-primary/25 pb-1 text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:border-primary"
        >
          Ask About This Cake
        </a>
      </div>
    </article>
  );
}
