import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { user, checkAdminStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        if (!user) {
          // Only redirect to sign-in if there is no user at all
          navigate('/auth');
          return;
        }

        // Use the centralized admin checking function
        const hasAdminRole = await checkAdminStatus();

        if (!hasAdminRole) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You do not have admin privileges to access this page.",
          });
          navigate('/'); // Redirect to home instead of sign-in
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Admin access verification error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem verifying your admin access.",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    verifyAdminAccess();
  }, [user, navigate, toast, checkAdminStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};