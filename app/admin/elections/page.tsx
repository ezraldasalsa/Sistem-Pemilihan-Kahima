import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Users, Vote, Clock, CheckCircle } from "lucide-react"

export default async function ElectionsPage() {
  const supabase = await createClient()

  // Get all elections
  const { data: elections } = await supabase
    .from("elections")
    .select(`
      *,
      candidates(count),
      votes(count)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Elections Management</h1>
          <p className="text-muted-foreground">Create and manage election campaigns</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Election
        </Button>
      </div>

      {/* Elections Grid */}
      {elections && elections.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {elections.map((election) => {
            const now = new Date()
            const startDate = new Date(election.start_date)
            const endDate = new Date(election.end_date)
            const isActive = election.is_active && now >= startDate && now <= endDate
            const isEnded = now > endDate
            const isUpcoming = now < startDate

            return (
              <Card key={election.id} className="border-primary/10 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{election.title}</CardTitle>
                      <CardDescription className="mt-1">{election.description}</CardDescription>
                    </div>
                    {isActive && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    {isEnded && (
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        Ended
                      </Badge>
                    )}
                    {isUpcoming && (
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {startDate.toLocaleDateString()}
                    </div>
                    <span>-</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {endDate.toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{election.candidates?.[0]?.count || 0} candidates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Vote className="w-4 h-4 text-primary" />
                        <span>{election.votes?.[0]?.count || 0} votes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Elections Yet</h3>
            <p className="text-muted-foreground mb-6">Create your first election to get started</p>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create First Election
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
