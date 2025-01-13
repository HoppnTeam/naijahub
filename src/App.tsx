import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AdminDashboard from "@/pages/admin/Dashboard";
import { Navigation } from "@/components/Navigation";
import Profile from "@/pages/Profile";
import CreatePost from "@/pages/CreatePost";
import PostDetails from "@/pages/PostDetails";
import NewsAndPolitics from "@/pages/categories/NewsAndPolitics";
import Entertainment from "@/pages/categories/Entertainment";
import Technology from "@/pages/categories/Technology";
import Sports from "@/pages/categories/Sports";
import Business from "@/pages/categories/Business";
import Health from "@/pages/categories/Health";
import Agriculture from "@/pages/categories/Agriculture";
import Travel from "@/pages/categories/Travel";
import Culture from "@/pages/categories/Culture";
import Automotive from "@/pages/categories/Automotive";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/categories/news-politics" element={<NewsAndPolitics />} />
          <Route path="/categories/entertainment" element={<Entertainment />} />
          <Route path="/categories/technology" element={<Technology />} />
          <Route path="/categories/sports" element={<Sports />} />
          <Route path="/categories/business" element={<Business />} />
          <Route path="/categories/health" element={<Health />} />
          <Route path="/categories/agriculture" element={<Agriculture />} />
          <Route path="/categories/travel" element={<Travel />} />
          <Route path="/categories/culture" element={<Culture />} />
          <Route path="/categories/automotive" element={<Automotive />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;