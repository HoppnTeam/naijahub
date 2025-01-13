import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      console.log("Checking admin session...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        return;
      }

      if (session) {
        console.log("Session found:", session.user.id);
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (rolesError) {
          console.error("Roles error:", rolesError);
          return;
        }

        console.log("User role:", roles?.role);
        if (roles?.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const getErrorMessage = (error: AuthError) => {
    console.error("Auth error details:", error);
    
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('Invalid login credentials')) {
            return "Invalid email or password. Please check your admin credentials and try again.";
          }
          if (error.message.includes('Email not confirmed')) {
            return "Please verify your email address before signing in.";
          }
          return "Invalid credentials. Please check your admin email and password.";
        case 422:
          return "Invalid email format. Please enter a valid email address.";
        case 429:
          return "Too many login attempts. Please try again later.";
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
      console.log("Attempting sign in...");
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }

      if (!session?.user) {
        console.error("No user found in session");
        throw new Error('No user found');
      }

      console.log("Checking admin role for user:", session.user.id);
      // Check if the user has admin role
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (rolesError) {
        console.error("Role check error:", rolesError);
        throw rolesError;
      }

      console.log("User roles:", roles);
      if (!roles || roles.role !== 'admin') {
        // If not an admin, sign them out and show error
        await supabase.auth.signOut();
        throw new Error('Unauthorized access: Admin privileges required');
      }

      toast({
        title: "Success",
        description: "Welcome back, admin!",
      });

      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Final error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof AuthError ? getErrorMessage(error) : error.message,
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
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
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