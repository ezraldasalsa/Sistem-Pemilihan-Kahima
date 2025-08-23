"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  student_id: string
  department: string
  year_level: number
  is_eligible_voter: boolean
  is_eligible_candidate: boolean
  profiles: {
    id: string
    email: string
    full_name: string
  }
}

interface EditStudentDialogProps {
  student: Student
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditStudentDialog({ student, open, onOpenChange }: EditStudentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    department: "",
    yearLevel: "",
    isEligibleVoter: true,
    isEligibleCandidate: true,
  })
  const router = useRouter()

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.profiles.full_name,
        email: student.profiles.email,
        studentId: student.student_id,
        department: student.department,
        yearLevel: student.year_level.toString(),
        isEligibleVoter: student.is_eligible_voter,
        isEligibleCandidate: student.is_eligible_candidate,
      })
    }
  }, [student])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          email: formData.email,
        })
        .eq("id", student.id)

      if (profileError) throw profileError

      // Update student record
      const { error: studentError } = await supabase
        .from("students")
        .update({
          student_id: formData.studentId,
          department: formData.department,
          year_level: Number.parseInt(formData.yearLevel),
          is_eligible_voter: formData.isEligibleVoter,
          is_eligible_candidate: formData.isEligibleCandidate,
        })
        .eq("id", student.id)

      if (studentError) throw studentError

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating student:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Update student information and permissions</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearLevel">Year Level</Label>
            <Select
              value={formData.yearLevel}
              onValueChange={(value) => setFormData({ ...formData, yearLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibleVoter"
                checked={formData.isEligibleVoter}
                onCheckedChange={(checked) => setFormData({ ...formData, isEligibleVoter: !!checked })}
              />
              <Label htmlFor="eligibleVoter">Eligible to vote</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibleCandidate"
                checked={formData.isEligibleCandidate}
                onCheckedChange={(checked) => setFormData({ ...formData, isEligibleCandidate: !!checked })}
              />
              <Label htmlFor="eligibleCandidate">Eligible to run as candidate</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
