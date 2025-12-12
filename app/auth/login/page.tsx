"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Vote, ArrowLeft, User, UserCheck } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGuestLoading, setIsGuestLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    setIsGuestLoading(true)
    // Store guest session in localStorage
    localStorage.setItem(
      "guestSession",
      JSON.stringify({
        isGuest: true,
        createdAt: new Date().toISOString(),
      }),
    )
    // Redirect directly to guest dashboard
    router.push("/guest")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Vote className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ElectVote</h1>
              <p className="text-sm text-muted-foreground">Student Election System</p>
            </div>
          </div>
        </div>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to access the election system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                <UserCheck className="w-4 h-4 mr-2" />
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue as</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 bg-transparent"
              onClick={handleGuestLogin}
              disabled={isGuestLoading}
            >
              <User className="w-4 h-4 mr-2" />
              {isGuestLoading ? "Redirecting..." : "Continue as Guest"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3">
              Guest access allows you to view elections and candidates without voting privileges
            </p>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary hover:text-primary/80 font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-2 justify-center flex-wrap">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Student Access
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Admin Access
          </Badge>
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-muted-foreground/20">
            Guest Access
          </Badge>
        </div>
      </div>
    </div>
  )
}
