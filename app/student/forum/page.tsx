import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageCircle, Send, Plus, ThumbsUp, Reply, Clock } from "lucide-react"

export default async function ForumPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Get forum discussions
  const { data: discussions } = await supabase
    .from("forum_discussions")
    .select(`
      *,
      students!inner(
        profiles!inner(full_name)
      ),
      forum_replies(count)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get recent replies
  const { data: recentReplies } = await supabase
    .from("forum_replies")
    .select(`
      *,
      students!inner(
        profiles!inner(full_name)
      ),
      forum_discussions!inner(title)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Forum</h1>
          <p className="text-muted-foreground">Discuss elections, candidates, and share your thoughts</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Discussions */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Recent Discussions
              </CardTitle>
              <CardDescription>Latest topics from the student community</CardDescription>
            </CardHeader>
            <CardContent>
              {discussions && discussions.length > 0 ? (
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {discussion.students.profiles.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{discussion.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {discussion.category?.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{discussion.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>By {discussion.students.profiles.full_name}</span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {discussion.forum_replies?.[0]?.count || 0} replies
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(discussion.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Reply className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No discussions yet</p>
                  <Button className="mt-2">Start the first discussion</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create New Discussion */}
          <Card>
            <CardHeader>
              <CardTitle>Start a New Discussion</CardTitle>
              <CardDescription>Share your thoughts with fellow students</CardDescription>
            </CardHeader>
            <CardContent>
              <form action="/api/forum/discussions" method="POST" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" name="category" className="w-full p-2 border rounded-md bg-background" required>
                    <option value="">Select category</option>
                    <option value="general">General Discussion</option>
                    <option value="candidates">About Candidates</option>
                    <option value="voting_process">Voting Process</option>
                    <option value="suggestions">Suggestions</option>
                    <option value="questions">Questions</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Discussion Title</Label>
                  <Input id="title" name="title" placeholder="What would you like to discuss?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Share your thoughts, questions, or ideas..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4 mr-2" />
                  Post Discussion
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Forum Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Forum Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Discussions</span>
                <span className="font-medium">{discussions?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Today</span>
                <span className="font-medium">
                  {discussions?.filter((d) => new Date(d.created_at).toDateString() === new Date().toDateString())
                    .length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Posts</span>
                <span className="font-medium">{discussions?.filter((d) => d.student_id === user.id).length || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest replies and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentReplies && recentReplies.length > 0 ? (
                <div className="space-y-3">
                  {recentReplies.map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <p className="font-medium">{reply.students.profiles.full_name}</p>
                      <p className="text-muted-foreground line-clamp-2">replied to "{reply.forum_discussions.title}"</p>
                      <p className="text-xs text-muted-foreground">{new Date(reply.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </CardContent>
          </Card>

          {/* Forum Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Forum Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be respectful to all members</li>
                <li>• Stay on topic</li>
                <li>• No spam or self-promotion</li>
                <li>• Use appropriate language</li>
                <li>• Report inappropriate content</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
