-- Create beta_testers table
CREATE TABLE IF NOT EXISTS beta_testers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    invitation_token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'invited', -- invited, active, inactive
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    activated_at TIMESTAMP WITH TIME ZONE,
    feedback_count INTEGER DEFAULT 0,
    notes TEXT,
    CONSTRAINT valid_status CHECK (status IN ('invited', 'active', 'inactive'))
);

-- Add RLS policies
ALTER TABLE beta_testers ENABLE ROW LEVEL SECURITY;

-- Only admins can view beta testers
CREATE POLICY "Admins can view beta testers" ON beta_testers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (SELECT email FROM admins)
        )
    );

-- Only admins can manage beta testers
CREATE POLICY "Admins can manage beta testers" ON beta_testers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (SELECT email FROM admins)
        )
    );

-- Create beta_feedback table
CREATE TABLE IF NOT EXISTS beta_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    beta_tester_id UUID REFERENCES beta_testers(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    rating INTEGER,
    status TEXT NOT NULL DEFAULT 'new', -- new, reviewed, implemented, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT valid_category CHECK (category IN ('bug', 'feature', 'improvement', 'other')),
    CONSTRAINT valid_status CHECK (status IN ('new', 'reviewed', 'implemented', 'rejected')),
    CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Add RLS policies
ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON beta_feedback
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create feedback
CREATE POLICY "Users can create feedback" ON beta_feedback
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback" ON beta_feedback
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON beta_feedback
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (SELECT email FROM admins)
        )
    );

-- Admins can manage all feedback
CREATE POLICY "Admins can manage all feedback" ON beta_feedback
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (SELECT email FROM admins)
        )
    );

-- Create function to update updated_at column
CREATE TRIGGER update_beta_feedback_updated_at
    BEFORE UPDATE
    ON beta_feedback
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beta_feedback_user ON beta_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_beta_tester ON beta_feedback(beta_tester_id);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_status ON beta_feedback(status);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_category ON beta_feedback(category);
