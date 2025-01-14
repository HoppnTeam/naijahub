import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Navigation } from "@/components/Navigation";

// Main app pages
const Index = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <section>
          <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to NaijaHub</h1>
          <p className="text-xl text-muted-foreground">
            Connect with Nigerians worldwide - Share news, discuss culture, and build community
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Categories */}
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">News & Politics</h2>
            <p>Stay updated with the latest happenings in Nigeria and worldwide.</p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Entertainment</h2>
            <p>Discover Nigerian music, movies, and cultural events.</p>
          </div>
          
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Technology</h2>
            <p>Explore tech innovations and digital transformation in Nigeria.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
);

// Admin pages
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