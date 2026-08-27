import { business } from "@/content/site";

export function waLink(message: string) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const defaultMessage = `Hi ${business.name}, I'm interested in ordering a cake. I'd love to learn more about your available designs and flavors.`;

export function cakeMessage(cakeName: string) {
  return `Hi, I'm interested in this cake: ${cakeName}. Can you please provide more information?`;
}
