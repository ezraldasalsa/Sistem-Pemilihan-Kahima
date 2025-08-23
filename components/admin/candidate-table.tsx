"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ViewCandidateDialog } from "./view-candidate-dialog"
import { MoreHorizontal, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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

interface CandidateTableProps {
  candidates: Candidate[]
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null)
  const router = useRouter()

  const toggleApproval = async (candidateId: string, currentStatus: boolean) => {
    const supabase = createClient()

    const { error } = await supabase.from("candidates").update({ is_approved: !currentStatus }).eq("id", candidateId)

    if (!error) {
      router.refresh()
    }
  }

  const deleteCandidate = async (candidateId: string) => {
    if (!confirm("Are you sure you want to delete this candidate? This action cannot be undone.")) {
      return
    }

    const supabase = createClient()

    const { error } = await supabase.from("candidates").delete().eq("id", candidateId)

    if (!error) {
      router.refresh()
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Election</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={candidate.image_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {candidate.students.profiles.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{candidate.students.profiles.full_name}</div>
                      <div className="text-sm text-muted-foreground">ID: {candidate.students.student_id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{candidate.elections.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {candidate.elections.is_active ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{candidate.students.department}</div>
                    <div className="text-sm text-muted-foreground">Year {candidate.students.year_level}</div>
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="font-mono">{candidate.vote_count}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(candidate.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingCandidate(candidate)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleApproval(candidate.id, candidate.is_approved)}>
                        {candidate.is_approved ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteCandidate(candidate.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {viewingCandidate && (
        <ViewCandidateDialog
          candidate={viewingCandidate}
          open={!!viewingCandidate}
          onOpenChange={(open) => !open && setViewingCandidate(null)}
        />
      )}
    </>
  )
}
