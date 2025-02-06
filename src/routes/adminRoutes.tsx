import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { Dashboard } from "@/pages/admin/Dashboard";
import { CategoriesManagement } from "@/pages/admin/CategoriesManagement";
import PostModeration from "@/pages/admin/PostModeration";
import { ReportsManagement } from "@/pages/admin/ReportsManagement";
import { AdsManagement } from "@/pages/admin/AdsManagement";
import { Settings } from "@/pages/admin/Settings";

export const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedAdminRoute>
      <Dashboard />
    </ProtectedAdminRoute>,
  },
  {
    path: "/admin/categories",
    element: <ProtectedAdminRoute>
      <CategoriesManagement />
    </ProtectedAdminRoute>,
  },
  {
    path: "/admin/posts",
    element: <ProtectedAdminRoute>
      <PostModeration />
    </ProtectedAdminRoute>,
  },
  {
    path: "/admin/reports",
    element: <ProtectedAdminRoute>
      <ReportsManagement />
    </ProtectedAdminRoute>,
  },
  {
    path: "/admin/ads",
    element: <ProtectedAdminRoute>
      <AdsManagement />
    </ProtectedAdminRoute>,
  },
  {
    path: "/admin/settings",
    element: <ProtectedAdminRoute>
      <Settings />
    </ProtectedAdminRoute>,
  }
];