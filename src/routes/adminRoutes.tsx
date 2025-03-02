import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { LoadingFallback } from "@/components/ui/LoadingFallback";

// Lazy load all admin components
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const CategoriesManagement = lazy(() => import("@/pages/admin/CategoriesManagement"));
const PostModeration = lazy(() => import("@/pages/admin/PostModeration"));
const ReportsManagement = lazy(() => import("@/pages/admin/ReportsManagement"));
const AdsManagement = lazy(() => import("@/pages/admin/AdsManagement"));
const MarketplaceManagement = lazy(() => import("@/pages/admin/MarketplaceManagement"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/admin/analytics",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Analytics />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/categories",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <CategoriesManagement />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/posts",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <PostModeration />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <ReportsManagement />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/ads",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <AdsManagement />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/marketplace",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <MarketplaceManagement />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedAdminRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Settings />
        </Suspense>
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/*",
    element: <Navigate to="/admin" replace />,
  },
];