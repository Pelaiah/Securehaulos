-- 1. Create shipper_company_details table
create table if not exists public.shipper_company_details (
  id uuid references auth.users primary key,
  company_name text not null,
  dba text,
  address text not null,
  commodity_type text not null,
  monthly_volume text not null,
  billing_contact_name text not null,
  billing_contact_email text not null,
  billing_contact_phone text not null,
  created_at timestamptz default now()
);

-- 2. Create carrier_applications table
create table if not exists public.carrier_applications (
  id uuid references auth.users primary key,
  company_name text not null,
  mc_number text not null,
  dot_number text not null,
  fleet_size int not null,
  insurance_doc_url text not null,
  created_at timestamptz default now()
);

-- 3. Create driver_applications table
create table if not exists public.driver_applications (
  id uuid references auth.users primary key,
  full_legal_name text not null,
  cdl_number text not null,
  cdl_doc_url text not null,
  truck_make text not null,
  truck_model text not null,
  truck_year text not null,
  truck_vin text not null,
  own_authority boolean not null default false,
  mc_number text,
  dot_number text,
  insurance_doc_url text not null,
  medical_card_url text not null,
  created_at timestamptz default now()
);

-- 4. Create firms table
create table if not exists public.firms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- 5. Create House Firm for SecureHaul Direct
insert into public.firms (name) values ('SecureHaul Direct')
on conflict (name) do nothing;
