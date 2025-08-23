import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Star, Clock } from "lucide-react"

export default async function FeedbackPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Get student's previous feedback
  const { data: feedbacks } = await supabase
    .from("feedback")
    .select(`
      *,
      students!inner(
        profiles!inner(full_name)
      )
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feedback & Suggestions</h1>
          <p className="text-muted-foreground">Share your thoughts about the election system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Submit Feedback
            </CardTitle>
            <CardDescription>Help us improve the election system</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/feedback" method="POST" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" className="w-full p-2 border rounded-md bg-background" required>
                  <option value="">Select category</option>
                  <option value="voting_process">Voting Process</option>
                  <option value="candidate_info">Candidate Information</option>
                  <option value="user_interface">User Interface</option>
                  <option value="technical_issues">Technical Issues</option>
                  <option value="general_suggestion">General Suggestion</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="Brief description of your feedback" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Please provide detailed feedback or suggestions..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Overall Rating</Label>
                <select id="rating" name="rating" className="w-full p-2 border rounded-md bg-background" required>
                  <option value="">Rate your experience</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Very Poor</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previous Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Your Feedback History
            </CardTitle>
            <CardDescription>Previously submitted feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {feedbacks && feedbacks.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{feedback.subject}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{feedback.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feedback.message}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {feedback.category?.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No feedback submitted yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Guidelines</CardTitle>
          <CardDescription>Help us help you better</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">What to include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Specific details about issues</li>
                <li>• Steps to reproduce problems</li>
                <li>• Suggestions for improvements</li>
                <li>• Screenshots if applicable</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Response time:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Technical issues: 1-2 business days</li>
                <li>• General feedback: 3-5 business days</li>
                <li>• Urgent matters: Contact admin directly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
