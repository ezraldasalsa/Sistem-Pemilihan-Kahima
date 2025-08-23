"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, Mail, User, GraduationCap, Calendar } from "lucide-react"

interface Candidate {
  id: string
  platform: string
  image_url: string | null
  is_approved: boolean
  vote_count: number
  created_at: string
  students: {
    student_id: string
    department: string
    year_level: number
    profiles: {
      full_name: string
      email: string
    }
  }
  elections: {
    title: string
    is_active: boolean
    start_date: string
    end_date: string
  }
}

interface ViewCandidateDialogProps {
  candidate: Candidate
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCandidateDialog({ candidate, open, onOpenChange }: ViewCandidateDialogProps) {
  const router = useRouter()

  const toggleApproval = async () => {
    const supabase = createClient()

    const { error } = await supabase
      .from("candidates")
      .update({ is_approved: !candidate.is_approved })
      .eq("id", candidate.id)

    if (!error) {
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
          <DialogDescription>Review candidate information and platform</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidate Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.image_url || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {candidate.students.profiles.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{candidate.students.profiles.full_name}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student ID: {candidate.students.student_id}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {candidate.students.profiles.email}
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {candidate.students.department} - Year {candidate.students.year_level}
                </div>
              </div>
            </div>
            <Badge
              variant={candidate.is_approved ? "default" : "secondary"}
              className={
                candidate.is_approved
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-orange-100 text-orange-800 border-orange-200"
              }
            >
              {candidate.is_approved ? "Approved" : "Pending"}
            </Badge>
          </div>

          {/* Election Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Election Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Election:</span>
                <span>{candidate.elections.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={candidate.elections.is_active ? "default" : "secondary"}
                  className={candidate.elections.is_active ? "bg-green-100 text-green-800 border-green-200" : ""}
                >
                  {candidate.elections.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Votes:</span>
                <span className="font-mono">{candidate.vote_count}</span>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-medium mb-2">Campaign Platform</h4>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm leading-relaxed">{candidate.platform || "No platform statement provided."}</p>
            </div>
          </div>

          {/* Application Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Applied on {new Date(candidate.created_at).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={toggleApproval}
              className={
                candidate.is_approved ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
              }
            >
              {candidate.is_approved ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Candidate
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Candidate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
