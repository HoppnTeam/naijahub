import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        setError(null);
      }
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
      if (event === 'SIGNED_IN') {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          return "Invalid email or password. Please check your credentials and try again.";
        case 422:
          return "Invalid email format. Please enter a valid email address.";
        default:
          return error.message;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="w-full py-16 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Nigeria's Premier Online Community
        </h1>
        <p className="text-xl mb-8">
          Connect, Share, and Thrive with Nigerians Worldwide
        </p>
      </div>

      {/* Auth Container */}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Join NaijaHub</h2>
          <p className="text-gray-600 mt-2">
            Sign in to be part of our growing community
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#008000',
                  brandAccent: '#006400',
                }
              }
            },
            style: {
              button: {
                borderRadius: '8px',
                height: '44px',
                fontSize: '16px',
              },
              container: {
                gap: '16px',
              }
            }
          }}
          providers={[]}
        />
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FeatureCard
            icon="💬"
            title="Vibrant Discussions"
            description="Engage in meaningful conversations about topics that matter to Nigerians."
          />
          <FeatureCard
            icon="🛍️"
            title="Marketplace"
            description="Buy and sell with trusted members of the Nigerian community."
          />
          <FeatureCard
            icon="💼"
            title="Career Opportunities"
            description="Find your next career move with our curated job listings."
          />
          <FeatureCard
            icon="📰"
            title="Latest News"
            description="Stay updated with news and trends from Nigeria and the diaspora."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">Facebook</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="bg-white rounded-lg p-6 text-center shadow-lg">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Auth;