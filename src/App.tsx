import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Temporary placeholder component for Index
const Index = () => <div>Welcome to NaijaHub</div>;

// Temporary placeholder for non-admin routes
const Login = () => <div>Login Page</div>;

const Dashboard = () => (
  <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  </AdminLayout>
);

const UserManagement = () => (
  <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Management</h1>
    </div>
  </AdminLayout>
);

const PostModeration = () => (
  <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Post Moderation</h1>
    </div>
  </AdminLayout>
);

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
    path: "/admin",
    element: <Dashboard />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "/admin/posts",
    element: <PostModeration />,
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