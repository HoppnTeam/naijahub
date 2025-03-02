import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { handleAsyncError } from '@/lib/error-handling';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isAdmin, checkAdminStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setLoading(true);
        
        // First check if we already know the user is an admin from context
        if (isAdmin) {
          setHasAccess(true);
          setLoading(false);
          return;
        }
        
        // If not, check admin status directly
        if (user) {
          const isUserAdmin = await checkAdminStatus();
          setHasAccess(isUserAdmin);
        } else {
          setHasAccess(false);
        }
        
        setLoading(false);
      } catch (error) {
        handleAsyncError(error, 'Failed to verify admin access');
        setHasAccess(false);
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, isAdmin, checkAdminStatus]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : <Navigate to="/signin" replace />;
};