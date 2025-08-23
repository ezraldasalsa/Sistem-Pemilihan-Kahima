-- Create candidates table
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid references public.elections(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete cascade not null,
  platform text,
  image_url text,
  is_approved boolean default false,
  vote_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(election_id, student_id)
);

-- Enable RLS
alter table public.candidates enable row level security;

-- RLS policies for candidates
create policy "Everyone can view approved candidates"
  on public.candidates for select
  using (is_approved = true);

create policy "Students can view their own candidacy"
  on public.candidates for select
  using (
    student_id = auth.uid()
  );

create policy "Students can apply as candidates"
  on public.candidates for insert
  with check (
    student_id = auth.uid() and
    exists (
      select 1 from public.students
      where id = auth.uid() and is_eligible_candidate = true
    )
  );

create policy "Students can update their own candidacy"
  on public.candidates for update
  using (student_id = auth.uid());

create policy "Admins can manage all candidates"
  on public.candidates for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
