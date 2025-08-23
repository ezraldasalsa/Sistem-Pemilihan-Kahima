import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentSidebar } from "@/components/student/student-sidebar"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is student
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (!profile || profile.role !== "student") {
    redirect("/admin")
  }

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
