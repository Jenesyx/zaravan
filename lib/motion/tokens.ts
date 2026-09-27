export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  soft: "circ.out",
  spring: "elastic.out(1, 0.6)",
} as const;

export const DURATION = {
  instant: 0.15,
  quick: 0.35,
  base: 0.6,
  slow: 1,
  cinematic: 1.6,
} as const;

export const STAGGER = {
  characters: 0.06,
  lines: 0.08,
  cards: 0.12,
} as const;
