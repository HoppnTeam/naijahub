import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { UserManagement } from "@/pages/admin/UserManagement";
import { PostManagement } from "@/pages/admin/PostManagement";
import { ReportManagement } from "@/pages/admin/ReportManagement";
import { CategoryManagement } from "@/pages/admin/CategoryManagement";
import { Settings } from "@/pages/admin/Settings";
import { AdsManagement } from "@/pages/admin/AdsManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/posts" element={<PostManagement />} />
        <Route path="/admin/reports" element={<ReportManagement />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/ads" element={<AdsManagement />} />
      </Routes>
    </Router>
  );
};

export default App;