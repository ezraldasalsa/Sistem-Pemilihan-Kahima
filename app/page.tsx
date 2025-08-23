import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Vote, Users, Shield, BarChart3, CheckCircle, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ElectVote</h1>
                <p className="text-sm text-muted-foreground">Student Election System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            Modern Election Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Secure Digital Voting for Student Elections
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Empower your student association with a transparent, secure, and modern election platform. Vote for your
            chairperson with confidence and track results in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Start Voting
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-orange-900 mb-4">Democratic Excellence</h3>
            <p className="text-xl text-orange-700 max-w-2xl mx-auto">
              Experience a modern, secure, and transparent election platform designed for student democracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>End-to-end encryption ensures your vote remains private and secure</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Real-time Results</CardTitle>
                <CardDescription>Watch election results update live with transparent vote counting</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Student-Focused</CardTitle>
                <CardDescription>
                  Designed specifically for student associations and academic institutions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
                <CardDescription>Intuitive interface that makes voting simple for all students</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Scheduled Elections</CardTitle>
                <CardDescription>
                  Set up elections with specific start and end times for organized voting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Vote className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Candidate Profiles</CardTitle>
                <CardDescription>Comprehensive candidate information and platforms for informed voting</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-orange-900 mb-4">How It Works</h3>
            <p className="text-xl text-orange-700">Simple steps to make your voice heard in student governance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-orange-900 mb-2">Register</h4>
              <p className="text-orange-700">
                Create your account using your student credentials and verify your email address.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-orange-900 mb-2">Review</h4>
              <p className="text-orange-700">
                Learn about the candidates, their platforms, and participate in community discussions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-orange-900 mb-2">Vote</h4>
              <p className="text-orange-700">
                Cast your secure ballot and help shape the future of your student association.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to Modernize Your Elections?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of students who trust ElectVote for their democratic processes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-orange-100 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold">ElectVote</h4>
              </div>
              <p className="text-orange-200">Empowering student democracy through secure and transparent elections.</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-orange-200">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-white">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-orange-200">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-orange-200">
                <li>
                  <Link href="#" className="hover:text-white">
                    Student Portal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    University Website
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Academic Calendar
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-800 mt-8 pt-8 text-center text-orange-200">
            <p>&copy; 2024 ElectVote. All rights reserved. Built for student democracy.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
