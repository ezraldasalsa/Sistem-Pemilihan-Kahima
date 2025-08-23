-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('voting_process', 'candidate_info', 'user_interface', 'technical_issues', 'general_suggestion')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum discussions table
CREATE TABLE IF NOT EXISTS forum_discussions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('general', 'candidates', 'voting_process', 'suggestions', 'questions')),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID REFERENCES forum_discussions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum likes table
CREATE TABLE IF NOT EXISTS forum_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES forum_discussions(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, discussion_id),
  UNIQUE(student_id, reply_id),
  CHECK ((discussion_id IS NOT NULL AND reply_id IS NULL) OR (discussion_id IS NULL AND reply_id IS NOT NULL))
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback
CREATE POLICY "Students can view their own feedback" ON feedback
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own feedback" ON feedback
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can view all feedback" ON feedback
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for forum discussions
CREATE POLICY "Anyone can view forum discussions" ON forum_discussions
  FOR SELECT USING (true);

CREATE POLICY "Students can create discussions" ON forum_discussions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own discussions" ON forum_discussions
  FOR UPDATE USING (student_id = auth.uid());

-- RLS Policies for forum replies
CREATE POLICY "Anyone can view forum replies" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Students can create replies" ON forum_replies
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own replies" ON forum_replies
  FOR UPDATE USING (student_id = auth.uid());

-- RLS Policies for forum likes
CREATE POLICY "Students can manage their own likes" ON forum_likes
  FOR ALL USING (student_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_feedback_student_id ON feedback(student_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_forum_discussions_student_id ON forum_discussions(student_id);
CREATE INDEX idx_forum_discussions_category ON forum_discussions(category);
CREATE INDEX idx_forum_replies_discussion_id ON forum_replies(discussion_id);
CREATE INDEX idx_forum_replies_student_id ON forum_replies(student_id);
CREATE INDEX idx_forum_likes_student_id ON forum_likes(student_id);
