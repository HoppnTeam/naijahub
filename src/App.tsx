import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdsManagement } from "@/pages/admin/AdsManagement";
import AdminSignIn from "@/pages/admin/SignIn";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Profile from "@/pages/Profile";
import CreatePost from "@/pages/CreatePost";
import PostDetails from "@/pages/PostDetails";
import NewsAndPolitics from "@/pages/categories/NewsAndPolitics";
import Entertainment from "@/pages/categories/Entertainment";
import { EntertainmentCreatePost } from "@/components/posts/entertainment/EntertainmentCreatePost";
import Technology from "@/pages/categories/Technology";
import Sports from "@/pages/categories/Sports";
import Business from "@/pages/categories/Business";
import Health from "@/pages/categories/Health";
import Agriculture from "@/pages/categories/Agriculture";
import Travel from "@/pages/categories/Travel";
import Culture from "@/pages/categories/Culture";
import Automotive from "@/pages/categories/Automotive";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { TechnologyCreatePost } from "@/components/posts/technology/TechnologyCreatePost";
import { TravelCreatePost } from "@/components/posts/travel/TravelCreatePost";
import Advertise from "@/pages/Advertise";
import { BusinessCategoryCreatePost } from "@/components/posts/business/BusinessCategoryCreatePost";
import { AgricultureCreatePost } from "@/components/posts/agriculture/AgricultureCreatePost";
import { NewsDrafts } from "@/pages/admin/NewsDrafts";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/sign-in" element={<AdminSignIn />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/ads" 
              element={
                <ProtectedAdminRoute>
                  <AdsManagement />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/news-drafts" 
              element={
                <ProtectedAdminRoute>
                  <NewsDrafts />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/categories/news-politics" element={<NewsAndPolitics />} />
            <Route path="/categories/entertainment" element={<Entertainment />} />
            <Route path="/categories/entertainment/create" element={<EntertainmentCreatePost />} />
            <Route path="/categories/technology" element={<Technology />} />
            <Route path="/categories/technology/create" element={<TechnologyCreatePost />} />
            <Route path="/categories/sports" element={<Sports />} />
            <Route path="/categories/business" element={<Business />} />
            <Route path="/categories/business/create" element={<BusinessCategoryCreatePost />} />
            <Route path="/categories/health" element={<Health />} />
            <Route path="/categories/agriculture" element={<Agriculture />} />
            <Route path="/categories/agriculture/create" element={<AgricultureCreatePost />} />
            <Route path="/categories/travel" element={<Travel />} />
            <Route path="/categories/travel/create" element={<TravelCreatePost />} />
            <Route path="/categories/culture" element={<Culture />} />
            <Route path="/categories/automotive" element={<Automotive />} />
            <Route path="/advertise" element={<Advertise />} />
          </Routes>
          <Footer />
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;