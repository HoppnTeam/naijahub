-- Create a simple feedback table for beta testing
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    rating INTEGER,
    source TEXT DEFAULT 'beta',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_category CHECK (category IN ('bug', 'feature', 'improvement', 'other')),
    CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Add RLS policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON feedback
    FOR SELECT
    USING (
        (auth.uid() = user_id) OR 
        (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    );

-- Users can create feedback
CREATE POLICY "Users can create feedback" ON feedback
    FOR INSERT
    WITH CHECK (true);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON feedback
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (SELECT email FROM admins)
        )
    );

-- Admins can manage all feedback
CREATE POLICY "Admins can manage all feedback" ON feedback
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (SELECT email FROM admins)
        )
    );

-- Create function to update updated_at column
CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE
    ON feedback
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_source ON feedback(source);
