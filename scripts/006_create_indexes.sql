-- Create indexes for better performance
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);

create index if not exists idx_students_student_id on public.students(student_id);
create index if not exists idx_students_department on public.students(department);
create index if not exists idx_students_year_level on public.students(year_level);

create index if not exists idx_elections_active on public.elections(is_active);
create index if not exists idx_elections_dates on public.elections(start_date, end_date);

create index if not exists idx_candidates_election on public.candidates(election_id);
create index if not exists idx_candidates_student on public.candidates(student_id);
create index if not exists idx_candidates_approved on public.candidates(is_approved);

create index if not exists idx_votes_election on public.votes(election_id);
create index if not exists idx_votes_voter on public.votes(voter_id);
create index if not exists idx_votes_candidate on public.votes(candidate_id);
