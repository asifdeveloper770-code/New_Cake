// -----------------------------------------------------------------------
// EDIT THIS FILE to update business info, cakes, flavors and photos.
// Cake images live in src/assets/ — replace a file or add a new import.
// -----------------------------------------------------------------------
import cakeDulce from "@/assets/cake-dulce.jpg";
import cakeChocolate from "@/assets/cake-chocolate.jpg";
import cakeFruit from "@/assets/cake-fruit.jpg";
import cakeGuava from "@/assets/cake-guava.jpg";
import cakeNutella from "@/assets/cake-nutella.jpg";
import cakeTiered from "@/assets/cake-tiered.jpg";
import cakeBirthday from "@/assets/cake-birthday.jpg";

export const business = {
  name: "N.Y Nova Cake Studio",
  tagline: "Boutique celebration cakes, handcrafted in Miami Beach.",
  phoneDisplay: "305-540-7329",
  phoneLink: "+13055407329",
  whatsappNumber: "13055407329",
  email: "yaslendicaceres@gmail.com",
  serviceArea:
    "Miami Beach, South Beach, Mid-Beach, North Beach, Surfside, Bal Harbour, Sunny Isles and greater Miami.",
  hours: "Orders taken daily • 9am – 8pm",
};

export const flavors = [
  { name: "Dulce de Leche", note: "Slow-cooked caramel, silky and rich." },
  { name: "Whipped Cream", note: "Light, airy and delicately sweet." },
  { name: "Chocolate", note: "Deep cocoa sponge with velvet ganache." },
  { name: "Nutella", note: "Hazelnut cream layered generously." },
  { name: "Guava", note: "Tropical guava with a soft cream finish." },
  { name: "Assorted Fruit Fillings", note: "Seasonal berries, peach and more." },
];

export type Cake = {
  slug: string;
  name: string;
  description: string;
  filling: string;
  occasion: string;
  image: string;
  alt: string;
};

export const cakes: Cake[] = [
  {
    slug: "gold-leaf-signature",
    name: "Nova Signature",
    description:
      "Hand-textured buttercream finished with gold leaf and fresh blooms — our most requested celebration cake.",
    filling: "Whipped cream & assorted fruit",
    occasion: "Celebrations",
    image: cakeTiered,
    alt: "Minimalist ivory tiered celebration cake with a single white orchid",
  },
  {
    slug: "dulce-de-leche",
    name: "Dulce de Leche Torta",
    description:
      "Soft vanilla layers soaked in caramel, crowned with toasted meringue swirls.",
    filling: "Dulce de leche",
    occasion: "Anniversaries",
    image: cakeDulce,
    alt: "Dulce de leche layer cake with caramel drip and toasted meringue",
  },
  {
    slug: "dark-chocolate",
    name: "Midnight Chocolate",
    description:
      "Intense cocoa sponge under a mirror-glossy ganache with chocolate curls.",
    filling: "Chocolate",
    occasion: "Birthdays",
    image: cakeChocolate,
    alt: "Dark chocolate ganache cake with glossy finish and chocolate curls",
  },
  {
    slug: "guava-cream",
    name: "Guava & Cream",
    description:
      "A Miami classic — tropical guava ribboned through tender vanilla layers.",
    filling: "Guava & whipped cream",
    occasion: "Tropical",
    image: cakeGuava,
    alt: "Guava and cream layer cake sliced to show pink guava filling",
  },
  {
    slug: "nutella-hazelnut",
    name: "Nutella Hazelnut",
    description:
      "Chocolate sponge with Nutella cream and roasted hazelnuts throughout.",
    filling: "Nutella",
    occasion: "Birthdays",
    image: cakeNutella,
    alt: "Nutella hazelnut cake with smooth chocolate frosting and hazelnuts",
  },
  {
    slug: "fresh-fruit",
    name: "Garden Fruit Chantilly",
    description:
      "Cloud-light chantilly layered with seasonal fruit and edible flowers.",
    filling: "Whipped cream & assorted fruit",
    occasion: "Brunch & showers",
    image: cakeFruit,
    alt: "Whipped cream cake topped with berries, peaches and edible flowers",
  },
  {
    slug: "pastel-birthday",
    name: "Pastel Birthday",
    description:
      "Watercolour buttercream with piped shells — made for candles and wishes.",
    filling: "Choice of any filling",
    occasion: "Birthdays",
    image: cakeBirthday,
    alt: "Pastel birthday cake with piped buttercream shells and candles",
  },
];

export const occasions = [
  { title: "Birthdays", copy: "From first birthdays to milestone celebrations." },
  { title: "Weddings & Engagements", copy: "Refined tiered cakes for the day itself." },
  { title: "Baby Showers", copy: "Soft palettes, delicate detail, generous slices." },
  { title: "Corporate & Events", copy: "Branded, elegant cakes delivered on time." },
];

export const whyUs = [
  {
    title: "Made to order, never mass-produced",
    copy: "Every cake is baked fresh for your date and finished by hand in our Miami Beach studio.",
  },
  {
    title: "Design-led finishes",
    copy: "Clean lines, considered palettes and detailing that photographs beautifully.",
  },
  {
    title: "Flavour first",
    copy: "Real cream, real fruit, real dulce de leche. Nothing artificial in the fillings.",
  },
  {
    title: "Effortless ordering",
    copy: "One WhatsApp message and we handle design, tasting notes and delivery.",
  },
];
