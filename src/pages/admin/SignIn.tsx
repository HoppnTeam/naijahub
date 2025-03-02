import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, checkAdminStatus } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // If we have a user and they're an admin, redirect to admin panel
        if (user) {
          const hasAdminRole = await checkAdminStatus();
          if (hasAdminRole) {
            navigate('/admin');
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkSession();
  }, [user, navigate, checkAdminStatus]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case "Invalid login credentials":
          return "Invalid email or password. Please check your credentials and try again.";
        case "Email not confirmed":
          return "Please verify your email address before signing in.";
        default:
          return error.message;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const trimmedEmail = email.trim().toLowerCase();
      
      // First attempt to sign in
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!authData?.session?.user) {
        throw new Error('No user found in session');
      }

      // Use the centralized admin check
      const hasAdminRole = await checkAdminStatus();

      if (!hasAdminRole) {
        // If not admin, sign them out and show error
        await supabase.auth.signOut();
        throw new Error('Unauthorized access: Admin privileges required');
      }

      toast({
        title: "Success",
        description: "Welcome back, admin!",
      });

      navigate('/admin');
    } catch (error) {
      console.error("Sign in error:", error);
      
      let message = "An unexpected error occurred";
      
      if (error instanceof Error) {
        message = error.message;
        if (error instanceof AuthError) {
          message = getErrorMessage(error);
        }
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#32a852] hover:bg-[#2a8f45]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignIn;