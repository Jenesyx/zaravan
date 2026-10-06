export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  place: string;
};

// Business.md §7.3 draft layout copy only, shortened to one glance each.
// Business.md §7.4: replace with verified customer reviews before launch.
export const testimonials: Testimonial[] = [
  {
    id: "marta",
    quote: "I have never had threads this uniform. The colour comes out of them in about thirty seconds.",
    name: "Marta K.",
    place: "Hamburg, Germany",
  },
  {
    id: "elodie",
    quote: "The per-gram price at the 50 g tin is better than our previous supplier, and the quality isn’t close.",
    name: "Élodie M.",
    place: "Chef, Lyon, France",
  },
  {
    id: "david",
    quote: "I ordered on a Tuesday and it was on my counter in Toronto on Friday, duties already paid.",
    name: "David R.",
    place: "Toronto, Canada",
  },
  {
    id: "sara",
    quote: "My mother smelled it through the sealed pouch and told me I had finally bought the right one.",
    name: "Sara T.",
    place: "London, United Kingdom",
  },
  {
    id: "michael",
    quote: "The lab report and the harvest date on the jar are what convinced me, and the saffron lived up to them.",
    name: "Michael B.",
    place: "Portland, Oregon",
  },
];
