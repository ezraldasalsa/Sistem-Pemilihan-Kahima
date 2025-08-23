import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/student/profile-form"
import { User } from "lucide-react"

export default async function StudentProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Get student profile with all details
  const { data: student } = await supabase
    .from("students")
    .select(`
      *,
      profiles!inner(*)
    `)
    .eq("id", user.id)
    .single()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="max-w-2xl">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your profile details and account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm student={student} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
