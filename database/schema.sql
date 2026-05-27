-- Velora - schema Supabase/PostgreSQL
-- Cole este arquivo no SQL Editor do Supabase depois de criar o projeto.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'appointment_status') then
    create type public.appointment_status as enum ('agendado', 'concluido', 'cancelado', 'pendente');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age integer check (age is null or (age >= 0 and age <= 120)),
  phone text,
  address text,
  neighborhood text,
  notes text,
  birth_date date,
  preferences text,
  allergies text,
  hair_type text,
  favorite_products text,
  chemical_history text,
  service_frequency text,
  before_photo_url text,
  after_photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text,
  category text,
  stock_quantity numeric(12,2) not null default 0,
  low_stock_threshold numeric(12,2) not null default 1 check (low_stock_threshold >= 0),
  cost numeric(12,2) check (cost is null or cost >= 0),
  notes text,
  is_running_low boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products drop constraint if exists products_stock_quantity_check;

create table if not exists public.service_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  service_type text not null,
  scheduled_at timestamptz not null,
  price numeric(12,2) not null default 0 check (price >= 0),
  payment_method text,
  notes text,
  duration_minutes integer check (duration_minutes is null or (duration_minutes >= 5 and duration_minutes <= 720)),
  status public.appointment_status not null default 'agendado',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_record_id uuid not null references public.service_records(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity_used numeric(12,2) not null default 1 check (quantity_used >= 0),
  notes text,
  created_at timestamptz not null default now(),
  unique (service_record_id, product_id)
);

create table if not exists public.product_stock_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  service_record_id uuid references public.service_records(id) on delete cascade,
  quantity_delta numeric(12,2) not null,
  reason text not null default 'service_sync',
  created_at timestamptz not null default now()
);

create table if not exists public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_record_id uuid references public.service_records(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  payment_method text,
  received_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_record_id)
);

create index if not exists clients_user_name_idx on public.clients(user_id, name);
create index if not exists clients_user_phone_idx on public.clients(user_id, phone);
create index if not exists products_user_name_idx on public.products(user_id, name);
create index if not exists products_low_stock_idx on public.products(user_id, stock_quantity, low_stock_threshold);
create index if not exists service_records_user_schedule_idx on public.service_records(user_id, scheduled_at);
create index if not exists service_records_user_status_idx on public.service_records(user_id, status);
create index if not exists service_records_client_idx on public.service_records(client_id, scheduled_at desc);
create index if not exists service_products_service_idx on public.service_products(service_record_id);
create index if not exists service_products_product_idx on public.service_products(product_id);
create index if not exists product_stock_movements_service_idx on public.product_stock_movements(service_record_id);
create index if not exists product_stock_movements_product_idx on public.product_stock_movements(product_id, created_at desc);
create index if not exists financial_entries_user_received_idx on public.financial_entries(user_id, received_at desc);
create index if not exists financial_entries_client_idx on public.financial_entries(client_id, received_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_service_records_updated_at on public.service_records;
create trigger set_service_records_updated_at
before update on public.service_records
for each row execute function public.set_updated_at();

drop trigger if exists set_financial_entries_updated_at on public.financial_entries;
create trigger set_financial_entries_updated_at
before update on public.financial_entries
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.sync_service_stock(p_service_record_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  service_owner uuid;
  service_status public.appointment_status;
  product_row record;
  current_delta numeric(12,2);
  target_delta numeric(12,2);
  diff numeric(12,2);
  available_stock numeric(12,2);
begin
  select user_id, status
  into service_owner, service_status
  from public.service_records
  where id = p_service_record_id;

  if service_owner is null then
    raise exception 'Atendimento não encontrado.';
  end if;

  if auth.uid() is null or service_owner <> auth.uid() then
    raise exception 'Acesso negado para sincronizar estoque.';
  end if;

  for product_row in
    select product_id, sum(quantity_used) as quantity_used
    from (
      select product_id, sum(quantity_used) as quantity_used
      from public.service_products
      where service_record_id = p_service_record_id
      group by product_id

      union all

      select product_id, 0::numeric as quantity_used
      from public.product_stock_movements
      where service_record_id = p_service_record_id
    ) products_to_sync
    group by product_id
  loop
    select coalesce(sum(quantity_delta), 0)
    into current_delta
    from public.product_stock_movements
    where service_record_id = p_service_record_id
      and product_id = product_row.product_id;

    target_delta := case
      when service_status = 'concluido' then -coalesce(product_row.quantity_used, 0)
      else 0
    end;

    diff := target_delta - current_delta;

    if diff <> 0 then
      select stock_quantity
      into available_stock
      from public.products
      where id = product_row.product_id
        and user_id = service_owner
      for update;

      if available_stock is null then
        raise exception 'Produto do atendimento não encontrado.';
      end if;

      update public.products
      set stock_quantity = stock_quantity + diff
      where id = product_row.product_id
        and user_id = service_owner;

      insert into public.product_stock_movements (
        user_id,
        product_id,
        service_record_id,
        quantity_delta,
        reason
      )
      values (
        service_owner,
        product_row.product_id,
        p_service_record_id,
        diff,
        case when diff < 0 then 'service_completed' else 'service_reverted' end
      );
    end if;
  end loop;
end;
$$;

revoke all on function public.sync_service_stock(uuid) from public;
grant execute on function public.sync_service_stock(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.service_records enable row level security;
alter table public.service_products enable row level security;
alter table public.product_stock_movements enable row level security;
alter table public.financial_entries enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-photos',
  'client-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
for select using (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists clients_select_own on public.clients;
create policy clients_select_own on public.clients
for select using (user_id = auth.uid());

drop policy if exists clients_insert_own on public.clients;
create policy clients_insert_own on public.clients
for insert with check (user_id = auth.uid());

drop policy if exists clients_update_own on public.clients;
create policy clients_update_own on public.clients
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists clients_delete_own on public.clients;
create policy clients_delete_own on public.clients
for delete using (user_id = auth.uid());

drop policy if exists products_select_own on public.products;
create policy products_select_own on public.products
for select using (user_id = auth.uid());

drop policy if exists products_insert_own on public.products;
create policy products_insert_own on public.products
for insert with check (user_id = auth.uid());

drop policy if exists products_update_own on public.products;
create policy products_update_own on public.products
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists products_delete_own on public.products;
create policy products_delete_own on public.products
for delete using (user_id = auth.uid());

drop policy if exists service_records_select_own on public.service_records;
create policy service_records_select_own on public.service_records
for select using (user_id = auth.uid());

drop policy if exists service_records_insert_own on public.service_records;
create policy service_records_insert_own on public.service_records
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.clients c
    where c.id = client_id and c.user_id = auth.uid()
  )
);

drop policy if exists service_records_update_own on public.service_records;
create policy service_records_update_own on public.service_records
for update using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.clients c
    where c.id = client_id and c.user_id = auth.uid()
  )
);

drop policy if exists service_records_delete_own on public.service_records;
create policy service_records_delete_own on public.service_records
for delete using (user_id = auth.uid());

drop policy if exists service_products_select_own on public.service_products;
create policy service_products_select_own on public.service_products
for select using (user_id = auth.uid());

drop policy if exists service_products_insert_own on public.service_products;
create policy service_products_insert_own on public.service_products
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.service_records sr
    where sr.id = service_record_id and sr.user_id = auth.uid()
  )
  and exists (
    select 1 from public.products p
    where p.id = product_id and p.user_id = auth.uid()
  )
);

drop policy if exists service_products_update_own on public.service_products;
create policy service_products_update_own on public.service_products
for update using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.service_records sr
    where sr.id = service_record_id and sr.user_id = auth.uid()
  )
  and exists (
    select 1 from public.products p
    where p.id = product_id and p.user_id = auth.uid()
  )
);

drop policy if exists service_products_delete_own on public.service_products;
create policy service_products_delete_own on public.service_products
for delete using (user_id = auth.uid());

drop policy if exists product_stock_movements_select_own on public.product_stock_movements;
create policy product_stock_movements_select_own on public.product_stock_movements
for select using (user_id = auth.uid());

drop policy if exists product_stock_movements_insert_own on public.product_stock_movements;
create policy product_stock_movements_insert_own on public.product_stock_movements
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.products p
    where p.id = product_id and p.user_id = auth.uid()
  )
);

drop policy if exists product_stock_movements_delete_own on public.product_stock_movements;
create policy product_stock_movements_delete_own on public.product_stock_movements
for delete using (user_id = auth.uid());

drop policy if exists financial_entries_select_own on public.financial_entries;
create policy financial_entries_select_own on public.financial_entries
for select using (user_id = auth.uid());

drop policy if exists financial_entries_insert_own on public.financial_entries;
create policy financial_entries_insert_own on public.financial_entries
for insert with check (
  user_id = auth.uid()
  and (client_id is null or exists (
    select 1 from public.clients c
    where c.id = client_id and c.user_id = auth.uid()
  ))
  and (service_record_id is null or exists (
    select 1 from public.service_records sr
    where sr.id = service_record_id and sr.user_id = auth.uid()
  ))
);

drop policy if exists financial_entries_update_own on public.financial_entries;
create policy financial_entries_update_own on public.financial_entries
for update using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (client_id is null or exists (
    select 1 from public.clients c
    where c.id = client_id and c.user_id = auth.uid()
  ))
  and (service_record_id is null or exists (
    select 1 from public.service_records sr
    where sr.id = service_record_id and sr.user_id = auth.uid()
  ))
);

drop policy if exists financial_entries_delete_own on public.financial_entries;
create policy financial_entries_delete_own on public.financial_entries
for delete using (user_id = auth.uid());

drop policy if exists client_photos_public_read on storage.objects;
create policy client_photos_public_read on storage.objects
for select using (bucket_id = 'client-photos');

drop policy if exists client_photos_insert_own on storage.objects;
create policy client_photos_insert_own on storage.objects
for insert with check (
  bucket_id = 'client-photos'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists client_photos_update_own on storage.objects;
create policy client_photos_update_own on storage.objects
for update using (
  bucket_id = 'client-photos'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'client-photos'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists client_photos_delete_own on storage.objects;
create policy client_photos_delete_own on storage.objects
for delete using (
  bucket_id = 'client-photos'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
