-- Enable RLS
alter table public.shipper_company_details enable row level security;
alter table public.carrier_applications enable row level security;
alter table public.driver_applications enable row level security;

-- Policies for shipper_company_details
create policy "Users can insert their own shipper details"
on public.shipper_company_details for insert
with check (auth.uid() = id);

create policy "Users can view their own shipper details"
on public.shipper_company_details for select
using (auth.uid() = id);

create policy "Users can update their own shipper details"
on public.shipper_company_details for update
using (auth.uid() = id);

-- Policies for carrier_applications
create policy "Users can insert their own carrier applications"
on public.carrier_applications for insert
with check (auth.uid() = id);

create policy "Users can view their own carrier applications"
on public.carrier_applications for select
using (auth.uid() = id);

create policy "Users can update their own carrier applications"
on public.carrier_applications for update
using (auth.uid() = id);

-- Policies for driver_applications
create policy "Users can insert their own driver applications"
on public.driver_applications for insert
with check (auth.uid() = id);

create policy "Users can view their own driver applications"
on public.driver_applications for select
using (auth.uid() = id);

create policy "Users can update their own driver applications"
on public.driver_applications for update
using (auth.uid() = id);

-- Policies for firms
alter table public.firms enable row level security;

create policy "Anyone can view firms"
on public.firms for select
using (true);

-- Only admins/system can insert or update firms. We can leave it without insert/update policies for users so it's read-only for them.
