export type Product = {
  id: string;
  name: string;
  grade: string;
  weight: string;
  format: string;
  price: number;
  pricePerGram: number | null;
  description: string;
  image: string;
};

// Prices, grades, sizes, and formats are transcribed from Business.md §3.2.
// Image paths are temporary stand-ins for Design.md §11: ten 4:5 product shots on black.
export const products: Product[] = [
  {
    id: "signature-vial",
    name: "Zaravan Signature — Vial",
    grade: "Super Negin",
    weight: "1 g",
    format: "Amber glass vial, cork",
    price: 14,
    pricePerGram: 14,
    description: "A first measure of our longest all-red threads. Drawn from one harvest and sealed at the field.",
    image: "/images/product-vial.svg",
  },
  {
    id: "signature-small",
    name: "Zaravan Signature — Small",
    grade: "Super Negin",
    weight: "3 g",
    format: "Amber glass jar, tin lid",
    price: 36,
    pricePerGram: 12,
    description: "Long, uniform stigmas from the top of the harvest. Enough to make the difference visible in every pot.",
    image: "/images/product-jar.svg",
  },
  {
    id: "signature-standard",
    name: "Zaravan Signature — Standard",
    grade: "Super Negin",
    weight: "5 g",
    format: "Amber glass jar, tin lid",
    price: 55,
    pricePerGram: 11,
    description: "Our family’s signature grade in a kitchen-size jar. The threads keep their shape, aroma, and measured colour.",
    image: "/images/product-jar.svg",
  },
  {
    id: "signature-large",
    name: "Zaravan Signature — Large",
    grade: "Super Negin",
    weight: "10 g",
    format: "Amber glass jar + refill pouch",
    price: 98,
    pricePerGram: 9.8,
    description: "The same hand-picked grade with a refill kept sealed from light. For kitchens that return to saffron often.",
    image: "/images/product-jar.svg",
  },
  {
    id: "select",
    name: "Zaravan Select",
    grade: "Negin",
    weight: "5 g",
    format: "Amber glass jar",
    price: 46,
    pricePerGram: 9.2,
    description: "All-red threads, slightly shorter than Signature. A measured harvest with the same clear origin.",
    image: "/images/product-jar.svg",
  },
  {
    id: "kitchen",
    name: "Zaravan Kitchen",
    grade: "Sargol",
    weight: "5 g",
    format: "Sealed tin",
    price: 39,
    pricePerGram: 7.8,
    description: "Cut all-red threads selected for cooking. Bloom a pinch and let the colour move through the dish.",
    image: "/images/product-tin.svg",
  },
  {
    id: "kitchen-large",
    name: "Zaravan Kitchen — Large",
    grade: "Sargol / Pushal",
    weight: "10 g",
    format: "Sealed tin",
    price: 62,
    pricePerGram: 6.2,
    description: "A generous kitchen tin with red stigmas and a trace of orange style. Kept airtight for the next service.",
    image: "/images/product-tin.svg",
  },
  {
    id: "heritage-bunch",
    name: "Zaravan Heritage — Bunch",
    grade: "Dasteh",
    weight: "10 g",
    format: "Hand-tied, wooden box",
    price: 48,
    pricePerGram: 4.8,
    description: "Whole flower threads tied as our family has long kept them. Red and white together, with a patient aroma.",
    image: "/images/product-box.svg",
  },
  {
    id: "gift-box",
    name: "Zaravan Gift Box",
    grade: "Super Negin 3 g + Negin 3 g",
    weight: "6 g",
    format: "Lacquered box, brass spoon, card",
    price: 79,
    pricePerGram: null,
    description: "Two grades from the same field, presented side by side. A small way to share the harvest and its story.",
    image: "/images/product-box.svg",
  },
  {
    id: "chef-trade",
    name: "Zaravan Chef / Trade",
    grade: "Super Negin",
    weight: "50 g",
    format: "Vacuum tin",
    price: 385,
    pricePerGram: 7.7,
    description: "Our signature threads packed for a working kitchen. One grade, one batch, with each order traceable.",
    image: "/images/product-tin.svg",
  },
];

export const priceLadder = [products[0], products[1], products[2], products[3], products[9]];
