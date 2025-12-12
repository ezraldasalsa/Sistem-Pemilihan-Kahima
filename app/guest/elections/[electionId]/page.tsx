import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Calendar, Users, ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function GuestElectionDetailPage({
  params,
}: {
  params: Promise<{ electionId: string }>
}) {
  const { electionId } = await params
  const supabase = await createClient()

  const { data: election } = await supabase.from("elections").select("*").eq("id", electionId).single()

  if (!election) {
    notFound()
  }

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*")
    .eq("election_id", electionId)
    .eq("status", "approved")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "upcoming":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30"
      case "completed":
        return "bg-muted text-muted-foreground border-muted-foreground/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/guest/elections"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Elections
      </Link>

      {/* Election Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{election.title}</h1>
            <Badge className={getStatusColor(election.status)}>{election.status}</Badge>
          </div>
          <p className="text-muted-foreground">{election.description}</p>
        </div>
        {election.status === "active" && (
          <Link href="/auth/sign-up">
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up to Vote
            </Button>
          </Link>
        )}
      </div>

      {/* Election Info */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Election Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium text-foreground">{new Date(election.start_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium text-foreground">{new Date(election.end_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Candidates</p>
                <p className="font-medium text-foreground">{candidates?.length || 0} running</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
          <CardDescription>Meet the candidates running in this election</CardDescription>
        </CardHeader>
        <CardContent>
          {candidates && candidates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="border-primary/10 bg-muted/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">{candidate.name}</h3>
                      <Badge variant="outline" className="mt-2 border-primary/30 text-primary">
                        Candidate
                      </Badge>
                    </div>
                    {candidate.platform && (
                      <div className="mt-4 pt-4 border-t border-primary/10">
                        <h4 className="text-sm font-medium text-foreground mb-2">Platform</h4>
                        <p className="text-sm text-muted-foreground line-clamp-4">{candidate.platform}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No candidates registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call to Action */}
      {election.status === "active" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <Vote className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Want to Vote?</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Create a student account to participate in this election and make your voice heard.
            </p>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
