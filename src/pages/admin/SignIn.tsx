import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          console.error("Role check error:", roleError);
          return;
        }

        if (roleData?.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.session?.user) {
        throw new Error('No user found in session');
      }

      // Then check if they have admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id)
        .single();

      if (roleError) {
        console.error("Role check error:", roleError);
        throw new Error('Error checking admin privileges');
      }

      if (!roleData || roleData.role !== 'admin') {
        // If not admin, sign them out and show error
        await supabase.auth.signOut();
        throw new Error('Unauthorized access: Admin privileges required');
      }

      // Log successful admin sign in
      await supabase.from('admin_activity_logs').insert({
        admin_id: data.session.user.id,
        action: 'SIGN_IN',
        details: { timestamp: new Date().toISOString() }
      });

      toast({
        title: "Success",
        description: "Welcome back, admin!",
      });

      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Sign in error:", error);
      
      let message = "An unexpected error occurred";
      
      if (error instanceof Error) {
        message = error.message;
        if (error.message.includes('Invalid login credentials')) {
          message = "Invalid email or password. Please try again.";
        } else if (error.message.includes('Admin privileges required')) {
          message = "This account does not have admin privileges.";
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