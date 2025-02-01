import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { adminRoutes } from "@/routes/adminRoutes";
import { categoryRoutes } from "@/routes/categoryRoutes";
import { mainRoutes } from "@/routes/mainRoutes";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Create a client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error("Query error:", error);
      },
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-grow">
                <Routes>
                  {/* Main Routes */}
                  {mainRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}

                  {/* Admin Routes */}
                  {adminRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}

                  {/* Category Routes */}
                  {categoryRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;