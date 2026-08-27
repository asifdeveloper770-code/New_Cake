import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/whatsapp";

type Props = {
  message: string;
  label?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md";
  className?: string;
};

export function WhatsAppButton({
  message,
  label = "Order via WhatsApp",
  variant = "solid",
  size = "md",
  className,
}: Props) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — opens WhatsApp`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-normal tracking-wide transition-all duration-300",
        size === "md" ? "min-h-12 px-7 text-sm" : "min-h-10 px-5 text-xs",
        variant === "solid" &&
          "bg-whatsapp text-whatsapp-foreground hover:brightness-95",
        variant === "outline" &&
          "border border-primary/25 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground",
        variant === "ghost" && "text-primary underline-offset-4 hover:underline",
        className,
      )}
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      {label}
    </a>
  );
}
