import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CandidateTable } from "@/components/admin/candidate-table"
import { Users, Clock, CheckCircle } from "lucide-react"

export default async function CandidatesPage() {
  const supabase = await createClient()

  // Get all candidates with their student and election info
  const { data: candidates } = await supabase
    .from("candidates")
    .select(`
      *,
      students!inner(
        student_id,
        department,
        year_level,
        profiles!inner(full_name, email)
      ),
      elections!inner(title, is_active, start_date, end_date)
    `)
    .order("created_at", { ascending: false })

  // Get statistics
  const { count: totalCandidates } = await supabase.from("candidates").select("*", { count: "exact", head: true })

  const { count: approvedCandidates } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true)

  const { count: pendingCandidates } = await supabase
    .from("candidates")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", false)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidate Management</h1>
          <p className="text-muted-foreground">Review and approve candidate applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates || 0}</div>
            <p className="text-xs text-muted-foreground">All applications</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCandidates || 0}</div>
            <p className="text-xs text-muted-foreground">Ready for voting</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCandidates || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
          <CardDescription>Review candidate applications and manage approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <CandidateTable candidates={candidates || []} />
        </CardContent>
      </Card>
    </div>
  )
}
