import { Link } from "@tanstack/react-router";
import { business } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-display text-xl">{business.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {business.tagline}
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>
              <a className="hover:text-foreground" href={`tel:${business.phoneLink}`}>
                {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-foreground" href={`mailto:${business.email}`}>
                {business.email}
              </a>
            </li>
            <li>{business.hours}</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>
              <Link className="hover:text-foreground" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" to="/cakes">
                Cakes &amp; Flavors
              </Link>
            </li>
            <li>
              <Link className="hover:text-foreground" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-5 py-6 text-center text-xs text-muted-foreground sm:px-8">
        Serving {business.serviceArea} © {new Date().getFullYear()} {business.name}.
      </div>
    </footer>
  );
}
