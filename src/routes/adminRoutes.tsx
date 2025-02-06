import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { Dashboard } from "@/pages/admin/Dashboard";
import { CategoriesManagement } from "@/pages/admin/CategoriesManagement";
import { PostModeration } from "@/pages/admin/PostModeration";
import { ReportsManagement } from "@/pages/admin/ReportsManagement";
import { AdsManagement } from "@/pages/admin/AdsManagement";
import { MarketplaceManagement } from "@/pages/admin/MarketplaceManagement";

export const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedAdminRoute>
      <div>
        {/* Wrap routes in a div since ProtectedAdminRoute expects children */}
      </div>
    </ProtectedAdminRoute>,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "posts",
        element: <PostModeration />,
      },
      {
        path: "categories",
        element: <CategoriesManagement />,
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