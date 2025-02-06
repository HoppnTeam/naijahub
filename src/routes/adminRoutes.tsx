import { Navigate } from "react-router-dom";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Analytics } from "@/pages/admin/Analytics";
import { SignIn } from "@/pages/admin/SignIn";
import { Settings } from "@/pages/admin/Settings";
import { CategoriesManagement } from "@/pages/admin/CategoriesManagement";
import { PostModeration } from "@/pages/admin/PostModeration";
import { ReportsManagement } from "@/pages/admin/ReportsManagement";
import { AdsManagement } from "@/pages/admin/AdsManagement";
import { MarketplaceManagement } from "@/pages/admin/MarketplaceManagement";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";

export const adminRoutes = [
  {
    path: "/admin/sign-in",
    element: <SignIn />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <Dashboard />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/analytics",
    element: (
      <ProtectedAdminRoute>
        <Analytics />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/categories",
    element: (
      <ProtectedAdminRoute>
        <CategoriesManagement />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/posts",
    element: (
      <ProtectedAdminRoute>
        <PostModeration />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedAdminRoute>
        <ReportsManagement />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/ads",
    element: (
      <ProtectedAdminRoute>
        <AdsManagement />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/marketplace",
    element: (
      <ProtectedAdminRoute>
        <MarketplaceManagement />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedAdminRoute>
        <Settings />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/*",
    element: <Navigate to="/admin" replace />,
  },
];