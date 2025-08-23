import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudentTable } from "@/components/admin/student-table"
import { AddStudentDialog } from "@/components/admin/add-student-dialog"
import { Users, Search, Download, Upload } from "lucide-react"

export default async function StudentsPage() {
  const supabase = await createClient()

  // Get all students with their profiles
  const { data: students } = await supabase
    .from("students")
    .select(`
      *,
      profiles!inner(
        id,
        email,
        full_name,
        created_at
      )
    `)
    .order("created_at", { ascending: false })

  // Get statistics
  const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })

  const { count: eligibleVoters } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("is_eligible_voter", true)

  const { count: eligibleCandidates } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("is_eligible_candidate", true)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground">Manage student accounts and eligibility</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <AddStudentDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Voters</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eligibleVoters || 0}</div>
            <p className="text-xs text-muted-foreground">Can participate in elections</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Candidates</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eligibleCandidates || 0}</div>
            <p className="text-xs text-muted-foreground">Can run for office</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>Manage student accounts and permissions</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search students..." className="pl-10 w-64 border-primary/20" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentTable students={students || []} />
        </CardContent>
      </Card>
    </div>
  )
}
