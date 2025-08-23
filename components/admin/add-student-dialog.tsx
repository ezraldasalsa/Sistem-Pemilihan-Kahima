"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export function AddStudentDialog() {
  const [open, setOpen] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: "TempPassword123!", // Temporary password - user should reset
        options: {
          data: {
            full_name: formData.fullName,
            role: "student",
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create student record
        const { error: studentError } = await supabase.from("students").insert({
          id: authData.user.id,
          student_id: formData.studentId,
          department: formData.department,
          year_level: Number.parseInt(formData.yearLevel),
          is_eligible_voter: formData.isEligibleVoter,
          is_eligible_candidate: formData.isEligibleCandidate,
        })

        if (studentError) throw studentError
      }

      setOpen(false)
      setFormData({
        fullName: "",
        email: "",
        studentId: "",
        department: "",
        yearLevel: "",
        isEligibleVoter: true,
        isEligibleCandidate: true,
      })
      router.refresh()
    } catch (error) {
      console.error("Error creating student:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Create a new student account in the system</DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
