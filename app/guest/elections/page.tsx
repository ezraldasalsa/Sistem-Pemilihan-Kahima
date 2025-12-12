import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Calendar, Eye } from "lucide-react"
import Link from "next/link"

export default async function GuestElectionsPage() {
  const supabase = await createClient()

  const { data: elections } = await supabase
    .from("elections")
    .select("*")
    .in("status", ["active", "upcoming", "completed"])
    .order("start_date", { ascending: false })

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Elections</h1>
        <p className="text-muted-foreground mt-1">Browse all elections and their details</p>
      </div>

      {/* Elections List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {elections && elections.length > 0 ? (
          elections.map((election) => (
            <Card key={election.id} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Vote className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className={getStatusColor(election.status)}>{election.status}</Badge>
                </div>
                <CardTitle className="mt-4">{election.title}</CardTitle>
                <CardDescription className="line-clamp-2">{election.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(election.start_date).toLocaleDateString()} -{" "}
                      {new Date(election.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link href={`/guest/elections/${election.id}`}>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-primary/30 hover:bg-primary/10 bg-transparent"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Election
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Vote className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Elections Available</h3>
            <p className="text-sm">Check back later for upcoming elections</p>
          </div>
        )}
      </div>
    </div>
  )
}
