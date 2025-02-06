import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { Dashboard } from "@/pages/admin/Dashboard";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminPosts } from "@/pages/admin/AdminPosts";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminReports } from "@/pages/admin/AdminReports";
import { AdminViolations } from "@/pages/admin/AdminViolations";
import { AdminAdvertisements } from "@/pages/admin/AdminAdvertisements";
import { AdminActivityLogs } from "@/pages/admin/AdminActivityLogs";
import { AdminWorkshops } from "@/pages/admin/AdminWorkshops";
import { AdminJobs } from "@/pages/admin/AdminJobs";
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
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "posts",
        element: <AdminPosts />,
      },
      {
        path: "categories",
        element: <AdminCategories />,
      },
      {
        path: "reports",
        element: <AdminReports />,
      },
      {
        path: "violations",
        element: <AdminViolations />,
      },
      {
        path: "advertisements",
        element: <AdminAdvertisements />,
      },
      {
        path: "activity-logs",
        element: <AdminActivityLogs />,
      },
      {
        path: "workshops",
        element: <AdminWorkshops />,
      },
      {
        path: "jobs",
        element: <AdminJobs />,
      },
      {
        path: "marketplace",
        element: <MarketplaceManagement />,
      },
    ],
  },
];
