import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Users, Calendar, Eye, ArrowRight, UserPlus } from "lucide-react"
import Link from "next/link"

export default async function GuestDashboard() {
  const supabase = await createClient()

  // Fetch public election data
  const { data: activeElections } = await supabase.from("elections").select("*").eq("status", "active")

  const { data: approvedCandidates } = await supabase
    .from("candidates")
    .select("*, elections(title)")
    .eq("status", "approved")
    .limit(6)

  const { data: upcomingElections } = await supabase
    .from("elections")
    .select("*")
    .eq("status", "upcoming")
    .order("start_date", { ascending: true })
    .limit(3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, Guest</h1>
          <p className="text-muted-foreground mt-1">
            Browse elections and candidates. Sign up to participate in voting.
          </p>
        </div>
        <Link href="/auth/sign-up">
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account to Vote
          </Button>
        </Link>
      </div>

      {/* Guest Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">You're viewing as a Guest</h3>
              <p className="text-sm text-muted-foreground mt-1">
                As a guest, you can browse active elections and view candidate profiles. To cast your vote and
                participate fully, please create a student account.
              </p>
              <div className="flex gap-2 mt-4">
                <Link href="/auth/sign-up">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" variant="outline" className="border-primary/30 bg-transparent">
                    Already have an account?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Elections</CardTitle>
            <Vote className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeElections?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Currently open for voting</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Candidates</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{approvedCandidates?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Approved candidates</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Elections</CardTitle>
            <Calendar className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{upcomingElections?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Starting soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Elections */}
      <Card className="border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Elections</CardTitle>
              <CardDescription>Elections currently open for voting</CardDescription>
            </div>
            <Link href="/guest/elections">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {activeElections && activeElections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeElections.map((election) => (
                <Card key={election.id} className="border-primary/10 bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{election.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{election.description}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Active</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span>Ends: {new Date(election.end_date).toLocaleDateString()}</span>
                    </div>
                    <Link href={`/guest/elections/${election.id}`}>
                      <Button size="sm" variant="outline" className="w-full mt-4 border-primary/30 bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Vote className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active elections at the moment</p>
              <p className="text-sm">Check back later for upcoming elections</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidates Preview */}
      <Card className="border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Featured Candidates</CardTitle>
              <CardDescription>Meet the candidates running for positions</CardDescription>
            </div>
            <Link href="/guest/candidates">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {approvedCandidates && approvedCandidates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {approvedCandidates.map((candidate) => (
                <Card key={candidate.id} className="border-primary/10 bg-muted/30">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">{candidate.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(candidate.elections as { title: string })?.title || "Election"}
                    </p>
                    <Badge variant="outline" className="mt-2 border-primary/30 text-primary">
                      Candidate
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No candidates available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
