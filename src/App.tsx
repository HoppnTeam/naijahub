import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { marketplaceRoutes } from "@/routes/marketplace";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";

export const App = () => {
  return (
    <Router>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile/:id" element={<Profile />} />
          {marketplaceRoutes}
        </Routes>
      </main>
    </Router>
  );
};