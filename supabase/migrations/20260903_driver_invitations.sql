create table if not exists public.driver_invitations (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references auth.users not null,
  token text unique not null,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

-- Turn on RLS
alter table public.driver_invitations enable row level security;

-- Policies for driver_invitations
create policy "Carriers can insert invitations"
  on public.driver_invitations for insert
  with check (auth.uid() = carrier_id);

create policy "Anyone can read an invitation token"
  on public.driver_invitations for select
  using (true);

create policy "Anyone can update used status"
  on public.driver_invitations for update
  using (true)
  with check (true);
