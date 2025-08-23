import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Vote, Calendar, User, CheckCircle, Clock, ArrowRight } from "lucide-react"

export default async function StudentDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Get student profile
  const { data: student } = await supabase
    .from("students")
    .select(`
      *,
      profiles!inner(full_name, email)
    `)
    .eq("id", user.id)
    .single()

  // Get active elections
  const { data: activeElections } = await supabase
    .from("elections")
    .select("*")
    .eq("is_active", true)
    .gte("end_date", new Date().toISOString())
    .order("start_date", { ascending: true })

  // Get student's votes
  const { data: votes } = await supabase
    .from("votes")
    .select(`
      *,
      elections!inner(title),
      candidates!inner(
        students!inner(
          profiles!inner(full_name)
        )
      )
    `)
    .eq("voter_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Get student's candidate applications
  const { data: applications } = await supabase
    .from("candidates")
    .select(`
      *,
      elections!inner(title, is_active)
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Check which elections student has voted in
  const votedElectionIds = votes?.map((vote) => vote.election_id) || []
  const availableElections = activeElections?.filter((election) => {
    const now = new Date()
    const startDate = new Date(election.start_date)
    const endDate = new Date(election.end_date)
    return now >= startDate && now <= endDate && !votedElectionIds.includes(election.id)
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {student?.profiles.full_name}!</h1>
          <p className="text-muted-foreground">Stay updated with the latest elections and make your voice heard</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Elections</CardTitle>
            <Vote className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableElections?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Ready to vote</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total participation</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Candidate applications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Elections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-primary" />
                  Active Elections
                </CardTitle>
                <CardDescription>Elections you can participate in</CardDescription>
              </div>
              <Link href="/student/elections">
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {availableElections && availableElections.length > 0 ? (
              <div className="space-y-4">
                {availableElections.slice(0, 3).map((election) => (
                  <div key={election.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{election.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{election.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Ends {new Date(election.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link href={`/vote/${election.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Vote Now
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active elections available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Voting History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Recent Votes
                </CardTitle>
                <CardDescription>Your voting participation history</CardDescription>
              </div>
              <Link href="/student/history">
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {votes && votes.length > 0 ? (
              <div className="space-y-4">
                {votes.map((vote) => (
                  <div key={vote.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{vote.elections.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Voted for: {vote.candidates.students.profiles.full_name}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(vote.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Voted
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No voting history yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Candidate Applications */}
      {applications && applications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  My Applications
                </CardTitle>
                <CardDescription>Your candidate application status</CardDescription>
              </div>
              <Link href="/student/applications">
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 3).map((application) => (
                <div key={application.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{application.elections.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Applied on {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={application.is_approved ? "default" : "secondary"}
                      className={
                        application.is_approved
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      }
                    >
                      {application.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/student/elections">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <Vote className="w-6 h-6 text-primary" />
                View Elections
              </Button>
            </Link>
            <Link href="/student/profile">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <User className="w-6 h-6 text-primary" />
                Update Profile
              </Button>
            </Link>
            <Link href="/student/history">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                <CheckCircle className="w-6 h-6 text-primary" />
                Voting History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
