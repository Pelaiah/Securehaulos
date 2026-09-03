-- 1. Create the `firms` table if it does not exist (assuming you have carriers).
-- You might already have a carriers/companies table, so adapt this as needed.
create table if not exists public.firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- 2. Create the profiles table
create table if not exists public.profiles (
  id uuid references auth.users primary key,
  role text not null check (role in ('shipper','carrier','driver')),
  status text not null default 'pending' check (status in ('pending', 'active', 'rejected')),
  firm_id uuid references public.firms(id), -- ties drivers to their carrier firm, nullable for shippers
  created_at timestamptz default now()
);

-- 3. Auth Hook: Customize Access Token claims
-- This injects the role and status from `profiles` into the JWT token for Next.js to read securely.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  claims jsonb;
  user_role text;
  user_status text;
begin
  select role, status into user_role, user_status from public.profiles where id = (event->>'user_id')::uuid;
  
  claims := event->'claims';
  
  -- Set the app_metadata role and status
  claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(user_role));
  claims := jsonb_set(claims, '{app_metadata,status}', to_jsonb(user_status));
  
  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- IMPORTANT: You must enable this function under Authentication -> Hooks -> Customize Access Token (JWT) Claims in your Supabase dashboard!

-- 4. Enable Row Level Security (RLS) on your tables (Example for `loads`)
-- Ensure your `loads` table has RLS enabled
-- alter table public.loads enable row level security;

-- Policy: Shippers see only their own loads
-- create policy "shippers see only their own loads"
-- on public.loads for select
-- using (auth.uid() = shipper_id);

-- Policy: Carriers see postable loadboard entries
-- create policy "carriers see postable loadboard entries"
-- on public.loads for select
-- using (
--   status = 'posted'
--   and exists (
--     select 1 from public.profiles
--     where id = auth.uid() and role = 'carrier'
--   )
-- );

-- Policy: Drivers see only loads assigned to them
-- create policy "drivers see only loads assigned to them"
-- on public.loads for select
-- using (
--   exists (
--     select 1 from public.profiles
--     where id = auth.uid() and role = 'driver' and id = public.loads.assigned_driver_id
--   )
-- );
