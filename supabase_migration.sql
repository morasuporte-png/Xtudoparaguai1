-- ════════════════════════════════════════════════════════════════
-- XTUDO PARAGUAI — SQL MIGRATION (versão corrigida)
-- Cole no SQL Editor do Supabase e execute com Run (Ctrl+Enter)
-- ════════════════════════════════════════════════════════════════

-- Limpar tabelas existentes (caso tenha rodado antes com erro)
drop table if exists public.addresses    cascade;
drop table if exists public.order_items  cascade;
drop table if exists public.orders       cascade;
drop table if exists public.products     cascade;
drop table if exists public.profiles     cascade;
drop function if exists public.handle_new_user() cascade;

-- ── 1. PROFILES ──────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  cpf         text,
  phone       text,
  role        text not null default 'buyer' check (role in ('buyer', 'seller')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profile_select" on public.profiles for select using (auth.uid() = id);
create policy "profile_all"    on public.profiles for all   using (auth.uid() = id);

-- Trigger: cria perfil automaticamente quando usuário faz cadastro
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'buyer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. PRODUCTS ───────────────────────────────────────────────────
create table public.products (
  id                uuid primary key default gen_random_uuid(),
  seller_id         uuid not null references auth.users on delete cascade,
  title             text not null,
  category          text not null,
  sub_category      text,
  description       text,
  brand             text,
  condition         text not null default 'new',
  origin            text not null default 'Paraguai',
  price_brl         numeric(12,2) not null,
  compare_price_brl numeric(12,2),
  stock             integer not null default 0,
  sku               text,
  warranty          text default '12',
  shipping          text default 'included',
  delivery_days     integer default 7,
  images            text[] default '{}',
  specs             jsonb default '[]',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products_select" on public.products for select using (is_active = true);
create policy "products_all"    on public.products for all   using (auth.uid() = seller_id);

-- ── 3. ORDERS ─────────────────────────────────────────────────────
create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  buyer_id        uuid not null references auth.users on delete cascade,
  status          text not null default 'pending'
                    check (status in ('pending','paid','shipped','delivered','cancelled')),
  total_brl       numeric(12,2) not null,
  payment_method  text,
  tracking_code   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "orders_select" on public.orders for select using (auth.uid() = buyer_id);
create policy "orders_insert" on public.orders for insert with check (auth.uid() = buyer_id);
create policy "orders_update" on public.orders for update using (auth.uid() = buyer_id);

-- ── 4. ORDER_ITEMS ────────────────────────────────────────────────
create table public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders on delete cascade,
  product_id  uuid,
  title       text not null,
  image_url   text,
  quantity    integer not null default 1,
  unit_price  numeric(12,2) not null
);
alter table public.order_items enable row level security;
create policy "items_select"
  on public.order_items for select
  using (order_id in (select id from public.orders where buyer_id = auth.uid()));
create policy "items_insert"
  on public.order_items for insert
  with check (order_id in (select id from public.orders where buyer_id = auth.uid()));

-- ── 5. ADDRESSES ──────────────────────────────────────────────────
create table public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  cep         text,
  street      text,
  number      text,
  complement  text,
  city        text,
  state       text,
  created_at  timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "addresses_all" on public.addresses for all using (auth.uid() = user_id);

-- ── 6. WISHLISTS ─────────────────────────────────────────────────
create table if not exists public.wishlists (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  product_id  uuid not null,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);
alter table public.wishlists enable row level security;
create policy "wishlists_all" on public.wishlists for all using (auth.uid() = user_id);

-- ── 7. REVIEWS ───────────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null,
  user_id     uuid not null references auth.users on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)   -- 1 review per user per product
);
alter table public.reviews enable row level security;
-- Anyone can read reviews
create policy "reviews_select" on public.reviews for select using (true);
-- Logged-in users can create/update/delete their own reviews
create policy "reviews_insert" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews_update" on public.reviews for update using (auth.uid() = user_id);
create policy "reviews_delete" on public.reviews for delete using (auth.uid() = user_id);

