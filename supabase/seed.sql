-- Zaravan product seed — transcribed from lib/data/products.ts (Business.md §3.2).
--   id            -> slug
--   price × 100   -> price_cents
--   pricePerGram × 100 (rounded) -> price_per_gram_cents (Gift Box stays null)
--   "N g"         -> weight_g
--   array order   -> sort (0-based)
--   stock         -> 20 per SKU (starting value; adjust in /admin)
-- Existing rows are left untouched so a re-run never overwrites admin edits.

insert into public.products
  (slug, collection, variant, name, grade, weight_g, format,
   price_cents, price_per_gram_cents, description, image, alt,
   stock, is_active, sort)
values
  ('signature-vial', 'Signature', 'Vial', 'Signature Vial', 'Super Negin', 1, 'Amber glass vial, cork',
   1400, 1400,
   'A first measure of our longest all-red threads. Drawn from one harvest and sealed at the field.',
   '/images/products/signature-vial.png',
   'Amber glass vial of Super Negin saffron threads with a cork stopper, lit from behind.',
   20, true, 0),

  ('signature-small', 'Signature', 'Small', 'Signature Small', 'Super Negin', 3, 'Amber glass jar, tin lid',
   3600, 1200,
   'Long, uniform stigmas from the top of the harvest. Enough to make the difference visible in every pot.',
   '/images/products/signature-small.png',
   'Closed amber jar of Super Negin saffron with a brushed brass lid.',
   20, true, 1),

  ('signature-standard', 'Signature', 'Standard', 'Signature Standard', 'Super Negin', 5, 'Amber glass jar, tin lid',
   5500, 1100,
   'Our family’s signature grade in a kitchen-size jar. The threads keep their shape, aroma, and measured colour.',
   '/images/products/signature-standard.png',
   'Open amber jar heaped with Super Negin threads, its brass lid leaning beside it.',
   20, true, 2),

  ('signature-large', 'Signature', 'Large', 'Signature Large', 'Super Negin', 10, 'Amber glass jar, refill pouch',
   9800, 980,
   'The same hand-picked grade with a refill kept sealed from light. For kitchens that return to saffron often.',
   '/images/products/signature-large.png',
   'Ten-gram amber jar with a brass lid beside a black refill pouch.',
   20, true, 3),

  ('select', 'Select', null, 'Select', 'Negin', 5, 'Amber glass jar',
   4600, 920,
   'All-red threads, slightly shorter than Signature. A measured harvest with the same clear origin.',
   '/images/products/select.png',
   'Open amber jar of Negin threads with a matte black lid resting against it.',
   20, true, 4),

  ('kitchen', 'Kitchen', null, 'Kitchen', 'Sargol', 5, 'Sealed tin',
   3900, 780,
   'Cut all-red threads selected for cooking. Bloom a pinch and let the colour move through the dish.',
   '/images/products/kitchen.png',
   'Closed black tin with a brass rim holding five grams of Sargol saffron.',
   20, true, 5),

  ('kitchen-large', 'Kitchen', 'Large', 'Kitchen Large', 'Sargol / Pushal', 10, 'Sealed tin',
   6200, 620,
   'A generous kitchen tin with red stigmas and a trace of orange style. Kept airtight for the next service.',
   '/images/products/kitchen-large.png',
   'Open black tin filled with Sargol threads, its lid propped against the side.',
   20, true, 6),

  ('heritage-bunch', 'Heritage', 'Bunch', 'Heritage Bunch', 'Dasteh', 10, 'Hand-tied, wooden box',
   4800, 480,
   'Whole flower threads tied as our family has long kept them. Red and white together, with a patient aroma.',
   '/images/products/heritage-bunch.png',
   'Hand-tied bunch of whole saffron threads, red tips and pale styles, in a wooden box.',
   20, true, 7),

  ('gift-box', 'Gift Box', null, 'Gift Box', 'Super Negin 3 g + Negin 3 g', 6, 'Lacquered box, brass spoon, card',
   7900, null,
   'Two grades from the same field, presented side by side. A small way to share the harvest and its story.',
   '/images/products/gift-box.png',
   'Open black gift box holding two saffron jars, a brass measuring spoon and a card.',
   20, true, 8),

  ('chef-trade', 'Chef & Trade', null, 'Chef & Trade', 'Super Negin', 50, 'Vacuum tin',
   38500, 770,
   'Our signature threads packed for a working kitchen. One grade, one batch, with each order traceable.',
   '/images/products/chef-trade.png',
   'Large black tin with a brass band holding fifty grams of Super Negin saffron.',
   20, true, 9)
on conflict (slug) do nothing;
