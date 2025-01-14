import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "@/pages/Index";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { Dashboard } from "@/pages/admin/Dashboard";
import { UserManagement } from "@/pages/admin/UserManagement";
import { PostModeration } from "@/pages/admin/PostModeration";
import { News } from "@/pages/categories/news/News";
import { Entertainment } from "@/pages/categories/entertainment/Entertainment";
import { Technology } from "@/pages/categories/technology/Technology";
import { Sports } from "@/pages/categories/sports/Sports";
import { Business } from "@/pages/categories/business/Business";
import { Health } from "@/pages/categories/health/Health";
import { Agriculture } from "@/pages/categories/agriculture/Agriculture";
import { Travel } from "@/pages/categories/travel/Travel";
import { Culture } from "@/pages/categories/culture/Culture";
import { Automotive } from "@/pages/categories/automotive/Automotive";
import { PostDetails } from "@/pages/posts/PostDetails";
import { CreatePost } from "@/pages/posts/CreatePost";
import { EditPost } from "@/pages/posts/EditPost";
import { Profile } from "@/pages/profile/Profile";
import { EditProfile } from "@/pages/profile/EditProfile";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { Toaster } from "@/components/ui/toaster";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <UserManagement />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/posts",
    element: (
      <AdminRoute>
        <PostModeration />
      </AdminRoute>
    ),
  },
  {
    path: "/categories/news-politics",
    element: <News />,
  },
  {
    path: "/categories/entertainment",
    element: <Entertainment />,
  },
  {
    path: "/categories/technology",
    element: <Technology />,
  },
  {
    path: "/categories/sports",
    element: <Sports />,
  },
  {
    path: "/categories/business",
    element: <Business />,
  },
  {
    path: "/categories/health",
    element: <Health />,
  },
  {
    path: "/categories/agriculture",
    element: <Agriculture />,
  },
  {
    path: "/categories/travel",
    element: <Travel />,
  },
  {
    path: "/categories/culture",
    element: <Culture />,
  },
  {
    path: "/categories/automotive",
    element: <Automotive />,
  },
  {
    path: "/posts/:id",
    element: <PostDetails />,
  },
  {
    path: "/posts/create",
    element: (
      <PrivateRoute>
        <CreatePost />
      </PrivateRoute>
    ),
  },
  {
    path: "/posts/:id/edit",
    element: (
      <PrivateRoute>
        <EditPost />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/profile/edit",
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}