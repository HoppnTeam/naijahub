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
    element: (
      <ProtectedAdminRoute>
        <Dashboard />
      </ProtectedAdminRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />
      },
      {
        path: "users",
        element: <Dashboard />
      },
      {
        path: "posts",
        element: <PostModeration />
      },
      {
        path: "reports",
        element: <ReportsManagement />
      },
      {
        path: "categories",
        element: <CategoriesManagement />
      },
      {
        path: "ads",
        element: <AdsManagement />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
  }
];