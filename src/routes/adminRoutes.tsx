import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

const Dashboard = lazy(() => import("@/pages/admin/Dashboard").then(module => ({ default: module.Dashboard })));
const ReportsManagement = lazy(() => import("@/pages/admin/ReportsManagement").then(module => ({ default: module.ReportsManagement })));
const AdsManagement = lazy(() => import("@/pages/admin/AdsManagement").then(module => ({ default: module.AdsManagement })));
const PostModeration = lazy(() => import("@/pages/admin/PostModeration"));
const CategoriesManagement = lazy(() => import("@/pages/admin/CategoriesManagement"));
const MarketplaceManagement = lazy(() => import("@/pages/admin/MarketplaceManagement").then(module => ({ default: module.MarketplaceManagement })));
const AdminSignIn = lazy(() => import("@/pages/admin/SignIn").then(module => ({ default: module.default })));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>
  },
  {
    path: "/admin/posts",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <PostModeration />
        </AdminLayout>
      </ProtectedAdminRoute>
    )
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <ReportsManagement />
        </AdminLayout>
      </ProtectedAdminRoute>
    )
  },
  {
    path: "/admin/categories",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <CategoriesManagement />
        </AdminLayout>
      </ProtectedAdminRoute>
    )
  },
  {
    path: "/admin/marketplace",
    element: (
      <ProtectedAdminRoute>
        <MarketplaceManagement />
      </ProtectedAdminRoute>
    )
  },
  {
    path: "/admin/ads",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <AdsManagement />
        </AdminLayout>
      </ProtectedAdminRoute>
    )
  },
  {
    path: "/admin/sign-in",
    element: <AdminSignIn />
  }
];