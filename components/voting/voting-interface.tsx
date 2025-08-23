"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Vote, CheckCircle, Clock, User, GraduationCap } from "lucide-react"

interface Election {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
}

interface Candidate {
  id: string
  platform: string
  image_url: string | null
  vote_count: number
  students: {
    student_id: string
    department: string
    year_level: number
    profiles: {
      full_name: string
    }
  }
}

interface VotingInterfaceProps {
  election: Election
  candidates: Candidate[]
  hasVoted: boolean
  userId: string
}

export function VotingInterface({ election, candidates, hasVoted, userId }: VotingInterfaceProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) return

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("votes").insert({
        election_id: election.id,
        voter_id: userId,
        candidate_id: selectedCandidate,
      })

      if (error) throw error

      setShowConfirmation(true)
    } catch (error) {
      console.error("Error submitting vote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center border-primary/10">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Vote Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for participating in the election. Your vote has been recorded securely.
            </p>
            <Button onClick={() => router.push("/student")} className="bg-primary hover:bg-primary/90">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center border-primary/10">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Already Voted</h2>
            <p className="text-muted-foreground mb-6">
              You have already cast your vote in this election. Thank you for participating!
            </p>
            <Button onClick={() => router.push("/student")} className="bg-primary hover:bg-primary/90">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Vote className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{election.title}</h1>
              <p className="text-muted-foreground">{election.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Voting ends on {new Date(election.end_date).toLocaleDateString()} at{" "}
              {new Date(election.end_date).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Voting Form */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Choose Your Candidate</CardTitle>
            <CardDescription>Select one candidate to cast your vote. This action cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate} className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30">
                  <RadioGroupItem value={candidate.id} id={candidate.id} className="mt-1" />
                  <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.image_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {candidate.students.profiles.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{candidate.students.profiles.full_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            ID: {candidate.students.student_id}
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {candidate.students.department} - Year {candidate.students.year_level}
                          </div>
                        </div>
                        {candidate.platform && (
                          <div className="mt-2">
                            <h4 className="font-medium text-sm mb-1">Platform:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{candidate.platform}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {candidates.length === 0 && (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No approved candidates for this election yet.</p>
              </div>
            )}

            {candidates.length > 0 && (
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/student")}>
                  Cancel
                </Button>
                <Button
                  onClick={handleVoteSubmit}
                  disabled={!selectedCandidate || isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Submitting Vote..." : "Cast Vote"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
