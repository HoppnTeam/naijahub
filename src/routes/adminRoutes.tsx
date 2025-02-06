import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { Dashboard } from "@/pages/admin/Dashboard";
import { MarketplaceManagement } from "@/pages/admin/MarketplaceManagement";

export const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "marketplace",
        element: <MarketplaceManagement />,
      },
    ],
  },
];