import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSignIn from "@/pages/admin/SignIn";
import Users from "@/pages/admin/Users";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Entertainment from "@/pages/categories/Entertainment";
import NewsAndPolitics from "@/pages/categories/NewsAndPolitics";
import Technology from "@/pages/categories/Technology";
import Sports from "@/pages/categories/Sports";
import Business from "@/pages/categories/Business";
import Health from "@/pages/categories/Health";
import Agriculture from "@/pages/categories/Agriculture";
import Travel from "@/pages/categories/Travel";
import Culture from "@/pages/categories/Culture";
import Automotive from "@/pages/categories/Automotive";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/sign-in" element={<AdminSignIn />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/categories/entertainment" element={<Entertainment />} />
            <Route path="/categories/news-politics" element={<NewsAndPolitics />} />
            <Route path="/categories/technology" element={<Technology />} />
            <Route path="/categories/sports" element={<Sports />} />
            <Route path="/categories/business" element={<Business />} />
            <Route path="/categories/health" element={<Health />} />
            <Route path="/categories/agriculture" element={<Agriculture />} />
            <Route path="/categories/travel" element={<Travel />} />
            <Route path="/categories/culture" element={<Culture />} />
            <Route path="/categories/automotive" element={<Automotive />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;