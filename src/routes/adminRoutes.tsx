import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";

const Dashboard = lazy(() => import("@/pages/admin/Dashboard").then(module => ({ default: module.Dashboard })));
const ReportsManagement = lazy(() => import("@/pages/admin/ReportsManagement").then(module => ({ default: module.ReportsManagement })));
const AdsManagement = lazy(() => import("@/pages/admin/AdsManagement").then(module => ({ default: module.AdsManagement })));
const PostModeration = lazy(() => import("@/pages/admin/PostModeration"));
const AdminSignIn = lazy(() => import("@/pages/admin/SignIn"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedAdminRoute children={undefined} />,
    children: [
      {
        index: true,
        element: <Dashboard />,
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
    ],
  },
  {
    path: "/admin/sign-in",
    element: <AdminSignIn />,
  },
];