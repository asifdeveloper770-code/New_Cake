import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { business } from "@/content/site";
import { defaultMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "./WhatsAppButton";

const nav = [
  { to: "/", label: "Home" },
  { to: "/cakes", label: "Cakes & Flavors" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="shrink-0 font-display text-lg leading-none tracking-tight transition-opacity hover:opacity-75 sm:text-xl"
        >
          N.Y Nova{" "}
          <span className="text-muted-foreground">
            Cake Studio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main"
          className="relative hidden flex-1 items-center justify-center md:flex"
        >
          <div className="flex items-center gap-10">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{
                  exact: item.to === "/",
                }}
                className="
                  relative
                  py-2
                  font-display
                  text-[15px]
                  font-medium
                  tracking-[0.025em]
                  text-muted-foreground
                  transition-colors
                  duration-300
                  hover:text-foreground

                  after:absolute
                  after:bottom-0
                  after:left-1/2
                  after:h-px
                  after:w-0
                  after:-translate-x-1/2
                  after:bg-foreground
                  after:transition-all
                  after:duration-300

                  hover:after:w-full
                "
                activeProps={{
                  className: `
                    relative
                    py-2
                    font-display
                    text-[15px]
                    font-medium
                    tracking-[0.025em]
                    text-foreground

                    after:absolute
                    after:bottom-0
                    after:left-1/2
                    after:h-px
                    after:w-full
                    after:-translate-x-1/2
                    after:bg-foreground
                  `,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* WhatsApp Button - Far Right */}
          <div className="absolute right-0">
            <WhatsAppButton
              message={defaultMessage}
              label="Order Via WhatsApp"
              size="md"
            />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <WhatsAppButton
            message={defaultMessage}
            label="WhatsApp"
            size="sm"
          />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={
              open ? "Close menu" : "Open menu"
            }
            className="
              inline-flex
              size-10
              items-center
              justify-center
              rounded-full
              border
              border-border
              text-foreground
              transition-colors
              hover:bg-muted
            "
          >
            {open ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="
            border-t
            border-border
            bg-background
            px-5
            pb-6
            pt-2
            md:hidden
          "
        >
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{
                exact: item.to === "/",
              }}
              className="
                relative
                block
                border-b
                border-border/60
                py-4
                font-display
                text-xl
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
              activeProps={{
                className: `
                  relative
                  block
                  border-b
                  border-border/60
                  py-4
                  font-display
                  text-xl
                  text-foreground
                `,
              }}
            >
              {item.label}
            </Link>
          ))}

          <p className="pt-4 text-sm text-muted-foreground">
            {business.phoneDisplay} · Miami Beach
          </p>
        </nav>
      )}
    </header>
  );
}