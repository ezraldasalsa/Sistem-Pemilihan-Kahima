import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VotingInterface } from "@/components/voting/voting-interface"

interface VotePageProps {
  params: {
    electionId: string
  }
}

export default async function VotePage({ params }: VotePageProps) {
  const supabase = await createClient()

  // Check authentication
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is a student
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || profile.role !== "student") {
    redirect("/admin")
  }

  // Get election details
  const { data: election } = await supabase
    .from("elections")
    .select("*")
    .eq("id", params.electionId)
    .eq("is_active", true)
    .single()

  if (!election) {
    redirect("/student")
  }

  // Check if election is currently active
  const now = new Date()
  const startDate = new Date(election.start_date)
  const endDate = new Date(election.end_date)

  if (now < startDate || now > endDate) {
    redirect("/student")
  }

  // Check if user has already voted
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("election_id", params.electionId)
    .eq("voter_id", data.user.id)
    .single()

  // Get approved candidates
  const { data: candidates } = await supabase
    .from("candidates")
    .select(`
      *,
      students!inner(
        student_id,
        department,
        year_level,
        profiles!inner(full_name)
      )
    `)
    .eq("election_id", params.electionId)
    .eq("is_approved", true)
    .order("created_at", { ascending: true })

  return (
    <VotingInterface
      election={election}
      candidates={candidates || []}
      hasVoted={!!existingVote}
      userId={data.user.id}
    />
  )
}
