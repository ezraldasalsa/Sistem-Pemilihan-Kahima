import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export default async function GuestCandidatesPage() {
  const supabase = await createClient()

  const { data: candidates } = await supabase
    .from("candidates")
    .select("*, elections(title, status)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Candidates</h1>
        <p className="text-muted-foreground mt-1">Browse all approved candidates across elections</p>
      </div>

      {/* Candidates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {candidates && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <Card key={candidate.id} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(candidate.elections as { title: string })?.title || "Election"}
                  </p>
                  <Badge
                    className={
                      (candidate.elections as { status: string })?.status === "active"
                        ? "bg-green-500/20 text-green-600 border-green-500/30 mt-2"
                        : "bg-muted text-muted-foreground border-muted-foreground/30 mt-2"
                    }
                  >
                    {(candidate.elections as { status: string })?.status || "Pending"}
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
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No Candidates Yet</h3>
            <p className="text-sm">Check back later when candidates are announced</p>
          </div>
        )}
      </div>
    </div>
  )
}
