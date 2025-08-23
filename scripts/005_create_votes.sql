-- Create votes table
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  election_id uuid references public.elections(id) on delete cascade not null,
  voter_id uuid references public.students(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(election_id, voter_id)
);

-- Enable RLS
alter table public.votes enable row level security;

-- RLS policies for votes
create policy "Students can view their own votes"
  on public.votes for select
  using (voter_id = auth.uid());

create policy "Students can cast votes"
  on public.votes for insert
  with check (
    voter_id = auth.uid() and
    exists (
      select 1 from public.students
      where id = auth.uid() and is_eligible_voter = true
    ) and
    exists (
      select 1 from public.elections
      where id = election_id and is_active = true
      and now() between start_date and end_date
    )
  );

create policy "Admins can view all votes"
  on public.votes for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create function to update candidate vote count
create or replace function public.update_candidate_vote_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.candidates
    set vote_count = vote_count + 1
    where id = NEW.candidate_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.candidates
    set vote_count = vote_count - 1
    where id = OLD.candidate_id;
    return OLD;
  end if;
  return null;
end;
$$;

-- Create triggers for vote counting
drop trigger if exists on_vote_insert on public.votes;
create trigger on_vote_insert
  after insert on public.votes
  for each row
  execute function public.update_candidate_vote_count();

drop trigger if exists on_vote_delete on public.votes;
create trigger on_vote_delete
  after delete on public.votes
  for each row
  execute function public.update_candidate_vote_count();
