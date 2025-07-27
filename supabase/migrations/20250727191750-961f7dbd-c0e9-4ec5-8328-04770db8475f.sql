-- Fix migration error by dropping existing function first
DROP FUNCTION IF EXISTS public.has_role(uuid, user_role);

-- Phase 1: Critical Database Security Fixes (continued)

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
CREATE OR REPLACE FUNCTION public.has_role(check_user_id UUID, role_name user_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_roles.user_id = check_user_id 
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