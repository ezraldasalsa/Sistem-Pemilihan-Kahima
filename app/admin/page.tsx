import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Vote, Calendar, TrendingUp, UserCheck, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get comprehensive statistics
  const [
    { count: totalStudents },
    { count: totalElections },
    { count: activeElections },
    { count: totalCandidates },
    { count: approvedCandidates },
    { count: totalVotes },
    { count: eligibleVoters },
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("elections").select("*", { count: "exact", head: true }),
    supabase.from("elections").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("candidates").select("*", { count: "exact", head: true }),
    supabase.from("candidates").select("*", { count: "exact", head: true }).eq("is_approved", true),
    supabase.from("votes").select("*", { count: "exact", head: true }),
    supabase.from("students").select("*", { count: "exact", head: true }).eq("can_vote", true),
  ])

  // Get voting participation rate
  const participationRate = eligibleVoters > 0 ? Math.round((totalVotes / eligibleVoters) * 100) : 0

  // Get recent elections
  const { data: recentElections } = await supabase
    .from("elections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get pending candidates
  const { data: pendingCandidates } = await supabase
    .from("candidates")
    .select(`
      *,
      students!inner(
        student_id,
        profiles!inner(full_name)
      ),
      elections!inner(title)
    `)
    .eq("is_approved", false)
    .limit(5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Election Management System Overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/elections">
            <Button className="bg-primary hover:bg-primary/90">
              <Calendar className="w-4 h-4 mr-2" />
              Create Election
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            <Vote className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeElections || 0}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
            <UserCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCandidates || 0}</div>
            <p className="text-xs text-muted-foreground">Approved / {totalCandidates || 0} total</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalVotes || 0}</div>
            <p className="text-xs text-muted-foreground">Votes cast</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <BarChart3 className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{participationRate}%</div>
            <p className="text-xs text-muted-foreground">Voter turnout</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Elections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Elections
            </CardTitle>
            <CardDescription>Latest election activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentElections && recentElections.length > 0 ? (
              <div className="space-y-4">
                {recentElections.map((election) => (
                  <div key={election.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{election.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(election.start_date).toLocaleDateString()} -{" "}
                        {new Date(election.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {election.is_active ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : new Date(election.end_date) < new Date() ? (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Ended
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          Scheduled
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                <Link href="/admin/elections">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Elections
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No elections created yet</p>
                <Link href="/admin/elections">
                  <Button className="mt-2">Create First Election</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Candidates awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingCandidates && pendingCandidates.length > 0 ? (
              <div className="space-y-4">
                {pendingCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{candidate.students.profiles.full_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {candidate.elections.title} • ID: {candidate.students.student_id}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-orange-200 text-orange-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                ))}
                <Link href="/admin/candidates">
                  <Button variant="outline" className="w-full bg-transparent">
                    Review All Candidates
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/elections">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="w-6 h-6 text-primary" />
                Manage Elections
              </Button>
            </Link>
            <Link href="/admin/students">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Users className="w-6 h-6 text-primary" />
                Manage Students
              </Button>
            </Link>
            <Link href="/admin/results">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <BarChart3 className="w-6 h-6 text-primary" />
                View Results
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
