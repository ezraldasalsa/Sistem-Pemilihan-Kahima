-- Create students table with additional student information
create table if not exists public.students (
  id uuid primary key references public.profiles(id) on delete cascade,
  student_id text unique not null,
  department text not null,
  year_level integer not null check (year_level between 1 and 4),
  is_eligible_voter boolean default true,
  is_eligible_candidate boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.students enable row level security;

-- RLS policies for students
create policy "Students can view their own data"
  on public.students for select
  using (auth.uid() = id);

create policy "Students can update their own data"
  on public.students for update
  using (auth.uid() = id);

create policy "Admins can view all students"
  on public.students for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert students"
  on public.students for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update students"
  on public.students for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete students"
  on public.students for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
