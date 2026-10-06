-- =============================================================================
-- Zaravan base schema
-- profiles, addresses, products, cart_items, orders, order_items
-- is_admin(), place_order(address jsonb), signup trigger, guards.
--
-- Conventions
--   * RLS on every table. No policy = denied.
--   * Policies use (select auth.uid()) and (select public.is_admin()).
--   * Money is integer cents, never negative. Currency is USD only.
--   * Table privileges are granted explicitly per role (least privilege) instead
--     of relying on Supabase's default "grant all to anon, authenticated".
--   * security definer functions: set search_path = '' and fully qualified names.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Shared: updated_at maintenance (invoker rights, no elevated access)
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;


-- =============================================================================
-- profiles
-- =============================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text check (full_name is null or char_length(full_name) <= 200),
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Owner may edit full_name only. `role` is not updatable through the API:
-- column-level grant below, plus a trigger guard in case grants are widened later.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;

create or replace function public.profiles_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Invoker rights on purpose: current_user is the API role making the request.
  -- SQL editor / migrations run as postgres and may change role (admin promotion).
  if new.role is distinct from old.role
     and current_user in ('anon', 'authenticated') then
    raise exception 'profiles.role cannot be changed through the API'
      using errcode = '42501';
  end if;
  if new.id is distinct from old.id then
    raise exception 'profiles.id is immutable' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.profiles_before_update() from public, anon, authenticated;

create or replace trigger profiles_before_update
  before update on public.profiles
  for each row execute function public.profiles_before_update();


-- -----------------------------------------------------------------------------
-- is_admin(): used by every admin policy and by lib/dal/auth.ts (rpc, no args)
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;


-- profiles policies
drop policy if exists "profiles: owner can select own row" on public.profiles;
create policy "profiles: owner can select own row"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles: admin can select all" on public.profiles;
create policy "profiles: admin can select all"
  on public.profiles for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "profiles: owner can update own row" on public.profiles;
create policy "profiles: owner can update own row"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- No insert policy: rows are created by the auth.users trigger below.
-- No delete policy: rows go away with the auth user (on delete cascade).


-- -----------------------------------------------------------------------------
-- Signup trigger: create the profile row for every new auth user.
-- role always defaults to 'customer' — never read it from user metadata,
-- which the signing-up client controls.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    nullif(left(btrim(new.raw_user_meta_data ->> 'full_name'), 200), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: accounts created before this migration also get a profile row.
insert into public.profiles (id)
select u.id from auth.users u
on conflict (id) do nothing;


-- =============================================================================
-- addresses
-- =============================================================================
create table if not exists public.addresses (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name         text not null check (char_length(name) between 1 and 200),
  line1        text not null check (char_length(line1) between 1 and 200),
  line2        text check (line2 is null or char_length(line2) <= 200),
  city         text not null check (char_length(city) between 1 and 100),
  region       text check (region is null or char_length(region) <= 100),
  postal_code  text check (postal_code is null or char_length(postal_code) <= 20),
  country      text not null check (country ~ '^[A-Z]{2}$'),       -- ISO 3166-1 alpha-2
  phone        text check (phone is null or char_length(phone) <= 40), -- carriers (DHL/FedEx) ask for it
  is_default   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.addresses enable row level security;

create index if not exists addresses_user_id_idx on public.addresses (user_id);
-- At most one default address per user. To switch default: unset the old one first.
create unique index if not exists addresses_one_default_per_user
  on public.addresses (user_id) where is_default;

revoke all on table public.addresses from anon, authenticated;
grant select, insert, update, delete on table public.addresses to authenticated;

create or replace trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

drop policy if exists "addresses: owner can select own" on public.addresses;
create policy "addresses: owner can select own"
  on public.addresses for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "addresses: owner can insert own" on public.addresses;
create policy "addresses: owner can insert own"
  on public.addresses for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "addresses: owner can update own" on public.addresses;
create policy "addresses: owner can update own"
  on public.addresses for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "addresses: owner can delete own" on public.addresses;
create policy "addresses: owner can delete own"
  on public.addresses for delete
  to authenticated
  using (user_id = (select auth.uid()));


-- =============================================================================
-- products  (canonical catalogue; lib/data/products.ts is now seed only)
-- =============================================================================
create table if not exists public.products (
  slug                  text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  collection            text not null check (collection in
                          ('Signature', 'Select', 'Kitchen', 'Heritage', 'Gift Box', 'Chef & Trade')),
  variant               text,
  name                  text not null check (char_length(name) between 1 and 120),
  grade                 text not null,
  weight_g              numeric(8, 2) not null check (weight_g > 0),
  format                text not null,
  price_cents           integer not null check (price_cents >= 0),
  price_per_gram_cents  integer check (price_per_gram_cents is null or price_per_gram_cents >= 0),
  description           text not null default '',
  image                 text not null,
  alt                   text not null default '',
  stock                 integer not null default 0 check (stock >= 0),
  is_active             boolean not null default true,
  sort                  integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.products enable row level security;

create index if not exists products_active_sort_idx on public.products (sort) where is_active;

revoke all on table public.products from anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;

create or replace trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop policy if exists "products: anyone can select active" on public.products;
create policy "products: anyone can select active"
  on public.products for select
  to anon, authenticated
  using (is_active);

drop policy if exists "products: admin can select all" on public.products;
create policy "products: admin can select all"
  on public.products for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "products: admin can insert" on public.products;
create policy "products: admin can insert"
  on public.products for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "products: admin can update" on public.products;
create policy "products: admin can update"
  on public.products for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Products that appear in any order cannot be deleted (order_items FK restrict);
-- deactivate them with is_active = false instead.
drop policy if exists "products: admin can delete" on public.products;
create policy "products: admin can delete"
  on public.products for delete
  to authenticated
  using ((select public.is_admin()));


-- =============================================================================
-- cart_items  (signed-in basket; guest basket lives in localStorage)
-- =============================================================================
create table if not exists public.cart_items (
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_slug  text not null references public.products (slug) on update cascade on delete cascade,
  quantity      integer not null check (quantity between 1 and 10),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  primary key (user_id, product_slug)
);

alter table public.cart_items enable row level security;

create index if not exists cart_items_product_slug_idx on public.cart_items (product_slug);

revoke all on table public.cart_items from anon, authenticated;
grant select, insert, update, delete on table public.cart_items to authenticated;

create or replace trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();

drop policy if exists "cart_items: owner can select own" on public.cart_items;
create policy "cart_items: owner can select own"
  on public.cart_items for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "cart_items: owner can insert own" on public.cart_items;
create policy "cart_items: owner can insert own"
  on public.cart_items for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.products p where p.slug = product_slug and p.is_active)
  );

drop policy if exists "cart_items: owner can update own" on public.cart_items;
create policy "cart_items: owner can update own"
  on public.cart_items for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "cart_items: owner can delete own" on public.cart_items;
create policy "cart_items: owner can delete own"
  on public.cart_items for delete
  to authenticated
  using (user_id = (select auth.uid()));


-- =============================================================================
-- orders
-- =============================================================================
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  -- set null (not cascade) so deleting an auth user never deletes order history
  user_id           uuid references auth.users (id) on delete set null,
  email             text,                       -- snapshot from auth.users at placement
  status            text not null default 'pending_payment' check (status in
                      ('pending_payment', 'paid', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  currency          text not null default 'USD' check (currency = 'USD'),
  subtotal_cents    integer not null check (subtotal_cents >= 0),
  shipping_cents    integer not null check (shipping_cents >= 0),
  total_cents       integer not null check (total_cents >= 0),
  shipping_address  jsonb not null check (jsonb_typeof(shipping_address) = 'object'),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint orders_total_is_sum check (total_cents = subtotal_cents + shipping_cents)
);

alter table public.orders enable row level security;

create index if not exists orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_created_at_idx on public.orders (status, created_at desc);

-- Customers read only. Admins may change `status` and nothing else.
-- Inserts happen only inside place_order() (security definer).
revoke all on table public.orders from anon, authenticated;
grant select on table public.orders to authenticated;
grant update (status) on table public.orders to authenticated;

-- Status lifecycle guard + restock on cancel.
--   pending_payment -> paid | cancelled
--   paid            -> packed | cancelled | refunded
--   packed          -> shipped | cancelled | refunded
--   shipped         -> delivered | refunded
--   delivered       -> refunded
--   cancelled, refunded: terminal
-- Cancelling returns the order's quantities to stock (goods never left).
-- security definer so the restock does not depend on the caller's product grants.
create or replace function public.orders_before_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if not (
         (old.status = 'pending_payment' and new.status in ('paid', 'cancelled'))
      or (old.status = 'paid'            and new.status in ('packed', 'cancelled', 'refunded'))
      or (old.status = 'packed'          and new.status in ('shipped', 'cancelled', 'refunded'))
      or (old.status = 'shipped'         and new.status in ('delivered', 'refunded'))
      or (old.status = 'delivered'       and new.status = 'refunded')
    ) then
      raise exception 'invalid order status change: % -> %', old.status, new.status
        using errcode = '22023';
    end if;

    if new.status = 'cancelled' then
      -- Same slug-order locking as place_order(), so the two can't deadlock.
      perform 1
        from public.products p
        join public.order_items oi on oi.product_slug = p.slug
       where oi.order_id = new.id
       order by p.slug
       for update of p;

      update public.products p
         set stock = p.stock + oi.quantity
        from public.order_items oi
       where oi.order_id = new.id
         and p.slug = oi.product_slug;
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.orders_before_update() from public, anon, authenticated;

create or replace trigger orders_before_update
  before update on public.orders
  for each row execute function public.orders_before_update();

drop policy if exists "orders: owner can select own" on public.orders;
create policy "orders: owner can select own"
  on public.orders for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "orders: admin can select all" on public.orders;
create policy "orders: admin can select all"
  on public.orders for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "orders: admin can update" on public.orders;
create policy "orders: admin can update"
  on public.orders for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- No insert policy (place_order only). No delete policy (orders are records).


-- =============================================================================
-- order_items  (snapshots — later catalogue edits never rewrite history)
-- =============================================================================
create table if not exists public.order_items (
  order_id          uuid not null references public.orders (id) on delete cascade,
  product_slug      text not null references public.products (slug) on update restrict on delete restrict,
  name              text not null,
  grade             text not null,
  weight_g          numeric(8, 2) not null check (weight_g > 0),
  unit_price_cents  integer not null check (unit_price_cents >= 0),
  quantity          integer not null check (quantity between 1 and 10),
  line_total_cents  integer generated always as (unit_price_cents * quantity) stored,
  primary key (order_id, product_slug)
);

alter table public.order_items enable row level security;

create index if not exists order_items_product_slug_idx on public.order_items (product_slug);

revoke all on table public.order_items from anon, authenticated;
grant select on table public.order_items to authenticated;

drop policy if exists "order_items: owner can select via own order" on public.order_items;
create policy "order_items: owner can select via own order"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = (select auth.uid())
    )
  );

drop policy if exists "order_items: admin can select all" on public.order_items;
create policy "order_items: admin can select all"
  on public.order_items for select
  to authenticated
  using ((select public.is_admin()));

-- No insert/update/delete policies: written only by place_order().


-- =============================================================================
-- place_order(address jsonb) -> order id
--
-- One transaction (a function call is atomic):
--   1. caller must be signed in
--   2. address is validated and whitelisted into a snapshot object
--   3. caller's cart rows + their products are locked (slug order, no deadlocks)
--   4. lines whose product is inactive or has stock = 0 are skipped and stay in
--      the cart (commerce-rules: unavailable lines are excluded from checkout)
--   5. any remaining line with stock < quantity aborts the whole order
--   6. prices come from products only; shipping per Business.md §4:
--        subtotal_cents > 7500 -> 0, else 1200 (flat $12 worldwide)
--   7. order (status 'pending_payment') + order_items snapshots inserted,
--      stock decremented, ordered lines removed from the cart
-- =============================================================================
create or replace function public.place_order(address jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id   uuid := (select auth.uid());
  v_email     text;
  v_address   jsonb;
  v_short     text;
  v_lines     integer;
  v_subtotal  bigint;
  v_shipping  integer;
  v_order_id  uuid;
begin
  if v_user_id is null
     or coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false) then
    raise exception 'sign in required' using errcode = '42501';
  end if;

  -- ---- address snapshot ----------------------------------------------------
  if address is null or jsonb_typeof(address) <> 'object' then
    raise exception 'address must be a JSON object' using errcode = '22023';
  end if;

  v_address := jsonb_strip_nulls(jsonb_build_object(
    'name',        nullif(btrim(address ->> 'name'), ''),
    'line1',       nullif(btrim(address ->> 'line1'), ''),
    'line2',       nullif(btrim(address ->> 'line2'), ''),
    'city',        nullif(btrim(address ->> 'city'), ''),
    'region',      nullif(btrim(address ->> 'region'), ''),
    'postal_code', nullif(btrim(address ->> 'postal_code'), ''),
    'country',     upper(nullif(btrim(address ->> 'country'), '')),
    'phone',       nullif(btrim(address ->> 'phone'), '')
  ));

  if v_address ->> 'name' is null
     or v_address ->> 'line1' is null
     or v_address ->> 'city' is null
     or coalesce(v_address ->> 'country', '') !~ '^[A-Z]{2}$' then
    raise exception 'address needs name, line1, city and a 2-letter country code'
      using errcode = '22023';
  end if;

  if char_length(v_address ->> 'name') > 200
     or char_length(v_address ->> 'line1') > 200
     or char_length(coalesce(v_address ->> 'line2', '')) > 200
     or char_length(v_address ->> 'city') > 100
     or char_length(coalesce(v_address ->> 'region', '')) > 100
     or char_length(coalesce(v_address ->> 'postal_code', '')) > 20
     or char_length(coalesce(v_address ->> 'phone', '')) > 40 then
    raise exception 'address field too long' using errcode = '22001';
  end if;

  -- ---- lock cart + products ------------------------------------------------
  perform 1
    from public.cart_items c
    join public.products p on p.slug = c.product_slug
   where c.user_id = v_user_id
   order by p.slug
   for update of c, p;

  -- ---- stock check on orderable lines -------------------------------------
  select string_agg(p.slug, ', ' order by p.slug)
    into v_short
    from public.cart_items c
    join public.products p on p.slug = c.product_slug
   where c.user_id = v_user_id
     and p.is_active
     and p.stock > 0
     and p.stock < c.quantity;

  if v_short is not null then
    raise exception 'insufficient stock for: %', v_short using errcode = 'P0001';
  end if;

  select u.email into v_email from auth.users u where u.id = v_user_id;

  -- ---- write ---------------------------------------------------------------
  -- Totals are written after the items and computed from them, so a cart row
  -- committed mid-function can never land in order_items without being billed.
  insert into public.orders
    (user_id, email, status, currency, subtotal_cents, shipping_cents, total_cents, shipping_address)
  values
    (v_user_id, v_email, 'pending_payment', 'USD', 0, 0, 0, v_address)
  returning id into v_order_id;

  insert into public.order_items
    (order_id, product_slug, name, grade, weight_g, unit_price_cents, quantity)
  select v_order_id, p.slug, p.name, p.grade, p.weight_g, p.price_cents, c.quantity
    from public.cart_items c
    join public.products p on p.slug = c.product_slug
   where c.user_id = v_user_id
     and p.is_active
     and p.stock >= c.quantity;

  select count(*), coalesce(sum(oi.unit_price_cents::bigint * oi.quantity), 0)
    into v_lines, v_subtotal
    from public.order_items oi
   where oi.order_id = v_order_id;

  if v_lines = 0 then
    raise exception 'basket has no available items' using errcode = 'P0001';
  end if;

  -- ---- shipping (Business.md §4) ------------------------------------------
  v_shipping := case when v_subtotal > 7500 then 0 else 1200 end;

  update public.orders
     set subtotal_cents = v_subtotal::integer,
         shipping_cents = v_shipping,
         total_cents    = (v_subtotal + v_shipping)::integer
   where id = v_order_id;

  update public.products p
     set stock = p.stock - oi.quantity
    from public.order_items oi
   where oi.order_id = v_order_id
     and p.slug = oi.product_slug;

  delete from public.cart_items c
   using public.order_items oi
   where oi.order_id = v_order_id
     and c.user_id = v_user_id
     and c.product_slug = oi.product_slug;

  return v_order_id;
end;
$$;

revoke all on function public.place_order(jsonb) from public, anon;
grant execute on function public.place_order(jsonb) to authenticated;
