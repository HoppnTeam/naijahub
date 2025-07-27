-- Phase 1: Critical Database Security Fixes

-- 1. Create security definer function to safely check admin roles (fixes privilege escalation)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.role = 'admin'
  );
$$;

-- 2. Create security definer function to check any role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name user_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.role = role_name
  );
$$;

-- 3. Drop existing recursive RLS policies on user_roles and recreate them safely
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- Create safe RLS policies for user_roles using security definer functions
CREATE POLICY "Users can view their own roles" 
ON user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" 
ON user_roles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can manage all roles" 
ON user_roles 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Add missing RLS policies for tables that don't have proper policies

-- Enable RLS on tables that don't have it enabled
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE beauty_professional_hours ENABLE ROW LEVEL SECURITY;

-- Add policies for error_logs (only admins should access)
CREATE POLICY "Only admins can view error logs" 
ON error_logs 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only admins can insert error logs" 
ON error_logs 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Add policies for beauty_professional_hours
CREATE POLICY "Beauty professional hours are viewable by everyone" 
ON beauty_professional_hours 
FOR SELECT 
USING (true);

CREATE POLICY "Professionals can manage their own hours" 
ON beauty_professional_hours 
FOR ALL 
USING (professional_id IN (
  SELECT id FROM beauty_professional_portfolios WHERE user_id = auth.uid()
))
WITH CHECK (professional_id IN (
  SELECT id FROM beauty_professional_portfolios WHERE user_id = auth.uid()
));

-- 5. Fix database functions to include proper search_path
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment counts
    UPDATE profiles SET followers_count = followers_count + 1 WHERE user_id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE user_id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement counts
    UPDATE profiles SET followers_count = followers_count - 1 WHERE user_id = OLD.following_id;
    UPDATE profiles SET following_count = following_count - 1 WHERE user_id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_user_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    point_value INTEGER;
BEGIN
    -- Set point value based on action type
    CASE 
        WHEN TG_TABLE_NAME = 'posts' THEN
            point_value := 10;
        WHEN TG_TABLE_NAME = 'comments' THEN
            point_value := 5;
        WHEN TG_TABLE_NAME = 'likes' THEN
            point_value := 2;
        WHEN TG_TABLE_NAME = 'followers' THEN
            point_value := 5;
        ELSE
            point_value := 0;
    END CASE;

    -- Update user points
    IF TG_TABLE_NAME = 'likes' THEN
        -- For likes, update the post owner's points
        UPDATE profiles 
        SET 
            points = points + point_value,
            level = GREATEST(1, FLOOR(POWER((points + point_value) / 100.0, 0.4))::INTEGER)
        WHERE user_id = (SELECT user_id FROM posts WHERE id = NEW.post_id);
    ELSE
        -- For other actions, update the acting user's points
        UPDATE profiles 
        SET 
            points = points + point_value,
            level = GREATEST(1, FLOOR(POWER((points + point_value) / 100.0, 0.4))::INTEGER)
        WHERE user_id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_and_award_achievements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  achievement_record RECORD;
BEGIN
  -- Check post milestones
  IF TG_TABLE_NAME = 'posts' THEN
    FOR achievement_record IN 
      SELECT * FROM achievements 
      WHERE type = 'post_milestone' 
      AND threshold = (
        SELECT COUNT(*) FROM posts WHERE user_id = NEW.user_id
      )
    LOOP
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (NEW.user_id, achievement_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Check engagement (likes received)
  IF TG_TABLE_NAME = 'likes' THEN
    FOR achievement_record IN 
      SELECT * FROM achievements 
      WHERE type = 'engagement' 
      AND threshold = (
        SELECT COUNT(*) FROM likes 
        INNER JOIN posts ON likes.post_id = posts.id 
        WHERE posts.user_id = (SELECT user_id FROM posts WHERE id = NEW.post_id)
      )
    LOOP
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES ((SELECT user_id FROM posts WHERE id = NEW.post_id), achievement_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  -- Check following milestones
  IF TG_TABLE_NAME = 'followers' THEN
    FOR achievement_record IN 
      SELECT * FROM achievements 
      WHERE type = 'following' 
      AND threshold = (
        SELECT followers_count FROM profiles WHERE user_id = NEW.following_id
      )
    LOOP
      INSERT INTO user_achievements (user_id, achievement_id)
      VALUES (NEW.following_id, achievement_record.id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$function$;

-- 6. Add constraint to prevent self-elevation of roles
ALTER TABLE user_roles ADD CONSTRAINT check_no_self_admin_elevation 
CHECK (
  CASE 
    WHEN role = 'admin' THEN 
      user_id != auth.uid() OR 
      EXISTS(SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
    ELSE true 
  END
);