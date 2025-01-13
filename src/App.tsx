import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import PostDetails from "@/pages/PostDetails";
import CreatePost from "@/pages/CreatePost";
import NewsAndPolitics from "@/pages/categories/NewsAndPolitics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/categories/news-politics" element={<NewsAndPolitics />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;