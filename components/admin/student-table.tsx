"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditStudentDialog } from "./edit-student-dialog"
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  student_id: string
  department: string
  year_level: number
  is_eligible_voter: boolean
  is_eligible_candidate: boolean
  created_at: string
  profiles: {
    id: string
    email: string
    full_name: string
    created_at: string
  }
}

interface StudentTableProps {
  students: Student[]
}

export function StudentTable({ students }: StudentTableProps) {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const router = useRouter()

  const toggleEligibility = async (
    studentId: string,
    field: "is_eligible_voter" | "is_eligible_candidate",
    currentValue: boolean,
  ) => {
    const supabase = createClient()

    const { error } = await supabase
      .from("students")
      .update({ [field]: !currentValue })
      .eq("id", studentId)

    if (!error) {
      router.refresh()
    }
  }

  const deleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return
    }

    const supabase = createClient()

    const { error } = await supabase.from("students").delete().eq("id", studentId)

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
              <TableHead>Student</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Voter Status</TableHead>
              <TableHead>Candidate Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{student.profiles.full_name}</div>
                    <div className="text-sm text-muted-foreground">{student.profiles.email}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{student.student_id}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.year_level}</TableCell>
                <TableCell>
                  <Badge
                    variant={student.is_eligible_voter ? "default" : "secondary"}
                    className={student.is_eligible_voter ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {student.is_eligible_voter ? "Eligible" : "Ineligible"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={student.is_eligible_candidate ? "default" : "secondary"}
                    className={student.is_eligible_candidate ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                  >
                    {student.is_eligible_candidate ? "Eligible" : "Ineligible"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(student.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingStudent(student)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleEligibility(student.id, "is_eligible_voter", student.is_eligible_voter)}
                      >
                        {student.is_eligible_voter ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Disable Voting
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Enable Voting
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toggleEligibility(student.id, "is_eligible_candidate", student.is_eligible_candidate)
                        }
                      >
                        {student.is_eligible_candidate ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Disable Candidacy
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Enable Candidacy
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteStudent(student.id)}
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

      {editingStudent && (
        <EditStudentDialog
          student={editingStudent}
          open={!!editingStudent}
          onOpenChange={(open) => !open && setEditingStudent(null)}
        />
      )}
    </>
  )
}
