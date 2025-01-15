import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { marketplaceRoutes } from "@/routes/marketplace";
import { Home } from "@/pages/Index";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { ResetPassword } from "@/pages/ResetPassword";
import { Dashboard } from "@/pages/Dashboard";
import { Categories } from "@/pages/Categories";
import { Technology } from "@/pages/Technology";

export const App = () => {
  return (
    <Router>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/technology" element={<Technology />} />
          {marketplaceRoutes}
        </Routes>
      </main>
    </Router>
  );
};