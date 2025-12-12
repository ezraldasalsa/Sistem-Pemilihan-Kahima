import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { GuestSidebar } from "@/components/guest/guest-sidebar"

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()

  // Get user profile if authenticated
  let profile = null
  if (data?.user) {
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()
    profile = profileData
  }

  const guestUser = data?.user || null
  const guestProfile = profile || {
    full_name: "Guest User",
    role: "guest",
  }

  return (
    <div className="min-h-screen bg-background">
      <GuestSidebar user={guestUser} profile={guestProfile} />
      <div className="lg:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
