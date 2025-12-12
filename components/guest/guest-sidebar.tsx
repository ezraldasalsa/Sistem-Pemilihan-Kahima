"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Vote, LayoutDashboard, Users, LogOut, Menu, X, Eye } from "lucide-react"
import { useState } from "react"
import type { User } from "@supabase/supabase-js"

interface GuestSidebarProps {
  user: User | null
  profile: {
    full_name: string
    role: string
  } | null
}

const navigation = [
  { name: "Dashboard", href: "/guest", icon: LayoutDashboard },
  { name: "View Elections", href: "/guest/elections", icon: Vote },
  { name: "View Candidates", href: "/guest/candidates", icon: Users },
]

export function GuestSidebar({ user, profile }: GuestSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    if (user) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    localStorage.removeItem("guestSession")
    router.push("/")
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-primary/10">
        <Link href="/guest" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Vote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">ElectVote</h1>
            <p className="text-xs text-muted-foreground">Guest Access</p>
          </div>
        </Link>
      </div>

      {/* Guest Notice */}
      <div className="px-4 py-3 mx-4 mt-4 bg-muted/50 rounded-lg border border-muted-foreground/20">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-medium">View Only Mode</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Sign up to vote in elections</p>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 border-2 border-muted">
            <AvatarFallback className="bg-muted text-muted-foreground">G</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{profile?.full_name || "Guest User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role || "guest"}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Link href="/auth/sign-up">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-primary/30 hover:bg-primary/10 bg-transparent"
            >
              <Users className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Exit Guest Mode
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="border-primary/20">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-card border-r border-primary/10">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-primary/10">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
