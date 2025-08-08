-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dimensions_w_cm int not null,
  dimensions_h_cm int not null,
  dimensions_label text not null,
  type text not null,
  price_gbp_pennies int not null,
  notes text null,
  image_path text not null unique,
  is_for_sale boolean not null default false,
  is_sold boolean not null default false,
  stripe_product_id text null,
  stripe_price_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: deny by default
alter table public.products enable row level security;

do $$ begin
  create policy "deny all" on public.products for all using (false) with check (false);
exception when duplicate_object then null; end $$;

-- Optional: extension for gen_random_uuid
create extension if not exists pgcrypto;


