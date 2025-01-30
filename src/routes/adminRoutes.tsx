import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdsManagement } from "@/pages/admin/AdsManagement";
import { NewsDrafts } from "@/pages/admin/NewsDrafts";
import AdminSignIn from "@/pages/admin/SignIn";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { RouteObject } from "react-router-dom";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin/sign-in",
    element: <AdminSignIn />
  },
  {
    path: "/admin",
    element: <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
  },
  {
    path: "/admin/ads",
    element: <ProtectedAdminRoute><AdsManagement /></ProtectedAdminRoute>
  },
  {
    path: "/admin/news-drafts",
    element: <ProtectedAdminRoute><NewsDrafts /></ProtectedAdminRoute>
  }
];