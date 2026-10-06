export type Collection = "Signature" | "Select" | "Kitchen" | "Heritage" | "Gift Box" | "Chef & Trade";

export type Product = {
  id: string;
  collection: Collection;
  /** Size or format within the collection; null when the collection has one SKU. */
  variant: string | null;
  name: string;
  grade: string;
  weight: string;
  format: string;
  price: number;
  pricePerGram: number | null;
  description: string;
  image: string;
  alt: string;
};

// Prices, grades, sizes, and formats are transcribed from Business.md §3.2.
// Images are the supplied 4:5 product shots in public/images/products, one per SKU.
export const products: Product[] = [
  {
    id: "signature-vial",
    collection: "Signature",
    variant: "Vial",
    name: "Signature Vial",
    grade: "Super Negin",
    weight: "1 g",
    format: "Amber glass vial, cork",
    price: 14,
    pricePerGram: 14,
    description: "A first measure of our longest all-red threads. Drawn from one harvest and sealed at the field.",
    image: "/images/products/signature-vial.png",
    alt: "Amber glass vial of Super Negin saffron threads with a cork stopper, lit from behind.",
  },
  {
    id: "signature-small",
    collection: "Signature",
    variant: "Small",
    name: "Signature Small",
    grade: "Super Negin",
    weight: "3 g",
    format: "Amber glass jar, tin lid",
    price: 36,
    pricePerGram: 12,
    description: "Long, uniform stigmas from the top of the harvest. Enough to make the difference visible in every pot.",
    image: "/images/products/signature-small.png",
    alt: "Closed amber jar of Super Negin saffron with a brushed brass lid.",
  },
  {
    id: "signature-standard",
    collection: "Signature",
    variant: "Standard",
    name: "Signature Standard",
    grade: "Super Negin",
    weight: "5 g",
    format: "Amber glass jar, tin lid",
    price: 55,
    pricePerGram: 11,
    description: "Our family’s signature grade in a kitchen-size jar. The threads keep their shape, aroma, and measured colour.",
    image: "/images/products/signature-standard.png",
    alt: "Open amber jar heaped with Super Negin threads, its brass lid leaning beside it.",
  },
  {
    id: "signature-large",
    collection: "Signature",
    variant: "Large",
    name: "Signature Large",
    grade: "Super Negin",
    weight: "10 g",
    format: "Amber glass jar, refill pouch",
    price: 98,
    pricePerGram: 9.8,
    description: "The same hand-picked grade with a refill kept sealed from light. For kitchens that return to saffron often.",
    image: "/images/products/signature-large.png",
    alt: "Ten-gram amber jar with a brass lid beside a black refill pouch.",
  },
  {
    id: "select",
    collection: "Select",
    variant: null,
    name: "Select",
    grade: "Negin",
    weight: "5 g",
    format: "Amber glass jar",
    price: 46,
    pricePerGram: 9.2,
    description: "All-red threads, slightly shorter than Signature. A measured harvest with the same clear origin.",
    image: "/images/products/select.png",
    alt: "Open amber jar of Negin threads with a matte black lid resting against it.",
  },
  {
    id: "kitchen",
    collection: "Kitchen",
    variant: null,
    name: "Kitchen",
    grade: "Sargol",
    weight: "5 g",
    format: "Sealed tin",
    price: 39,
    pricePerGram: 7.8,
    description: "Cut all-red threads selected for cooking. Bloom a pinch and let the colour move through the dish.",
    image: "/images/products/kitchen.png",
    alt: "Closed black tin with a brass rim holding five grams of Sargol saffron.",
  },
  {
    id: "kitchen-large",
    collection: "Kitchen",
    variant: "Large",
    name: "Kitchen Large",
    grade: "Sargol / Pushal",
    weight: "10 g",
    format: "Sealed tin",
    price: 62,
    pricePerGram: 6.2,
    description: "A generous kitchen tin with red stigmas and a trace of orange style. Kept airtight for the next service.",
    image: "/images/products/kitchen-large.png",
    alt: "Open black tin filled with Sargol threads, its lid propped against the side.",
  },
  {
    id: "heritage-bunch",
    collection: "Heritage",
    variant: "Bunch",
    name: "Heritage Bunch",
    grade: "Dasteh",
    weight: "10 g",
    format: "Hand-tied, wooden box",
    price: 48,
    pricePerGram: 4.8,
    description: "Whole flower threads tied as our family has long kept them. Red and white together, with a patient aroma.",
    image: "/images/products/heritage-bunch.png",
    alt: "Hand-tied bunch of whole saffron threads, red tips and pale styles, in a wooden box.",
  },
  {
    id: "gift-box",
    collection: "Gift Box",
    variant: null,
    name: "Gift Box",
    grade: "Super Negin 3 g + Negin 3 g",
    weight: "6 g",
    format: "Lacquered box, brass spoon, card",
    price: 79,
    pricePerGram: null,
    description: "Two grades from the same field, presented side by side. A small way to share the harvest and its story.",
    image: "/images/products/gift-box.png",
    alt: "Open black gift box holding two saffron jars, a brass measuring spoon and a card.",
  },
  {
    id: "chef-trade",
    collection: "Chef & Trade",
    variant: null,
    name: "Chef & Trade",
    grade: "Super Negin",
    weight: "50 g",
    format: "Vacuum tin",
    price: 385,
    pricePerGram: 7.7,
    description: "Our signature threads packed for a working kitchen. One grade, one batch, with each order traceable.",
    image: "/images/products/chef-trade.png",
    alt: "Large black tin with a brass band holding fifty grams of Super Negin saffron.",
  },
];

export const signatureLine = products.filter((product) => product.collection === "Signature");
export const collection = products.filter((product) => product.collection !== "Signature");

export const formatPrice = (value: number) => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
export const formatPerGram = (value: number) => `$${value.toFixed(2)}`;
