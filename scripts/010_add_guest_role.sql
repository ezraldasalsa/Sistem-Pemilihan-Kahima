-- Add guest role to profiles table and create guest account
-- Update the role check constraint to include 'guest'
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin', 'student', 'guest'));

-- Create RLS policy for guests to view public election data
create policy "Guests can view active elections"
  on public.elections for select
  using (status = 'active');

create policy "Guests can view approved candidates"
  on public.candidates for select
  using (status = 'approved');

-- Update handle_new_user function to support guest role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Unknown User'),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
