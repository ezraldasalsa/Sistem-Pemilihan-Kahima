-- Create elections table
create table if not exists public.elections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean default false,
  created_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint valid_election_dates check (end_date > start_date)
);

-- Enable RLS
alter table public.elections enable row level security;

-- RLS policies for elections
create policy "Everyone can view active elections"
  on public.elections for select
  using (is_active = true);

create policy "Admins can view all elections"
  on public.elections for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can manage elections"
  on public.elections for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
