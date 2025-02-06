import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { Dashboard } from "@/pages/admin/Dashboard";
import { CategoriesManagement } from "@/pages/admin/CategoriesManagement";
import { PostModeration } from "@/pages/admin/PostModeration";
import { ReportsManagement } from "@/pages/admin/ReportsManagement";
import { AdsManagement } from "@/pages/admin/AdsManagement";
import { MarketplaceManagement } from "@/pages/admin/MarketplaceManagement";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "categories",
        element: <CategoriesManagement />,
      },
      {
        path: "posts",
        element: <PostModeration />,
      },
      {
        path: "reports",
        element: <ReportsManagement />,
      },
      {
        path: "ads",
        element: <AdsManagement />,
      },
      {
        path: "marketplace",
        element: <MarketplaceManagement />,
      },
    ],
  },
];