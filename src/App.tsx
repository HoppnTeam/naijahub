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
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { handleAsyncError } from "@/lib/error-handling";
import { Suspense, lazy } from "react";

// Lazy load PWA components to prevent them from blocking the main app
const InstallPrompt = lazy(() => import("@/components/pwa/InstallPrompt"));
const OfflineIndicator = lazy(() => import("@/components/pwa/OfflineIndicator"));

// Create a client with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchInterval: false,
      networkMode: 'offlineFirst',
      meta: {
        errorHandler: (error: Error) => {
          handleAsyncError(error, "Failed to fetch data");
        }
      }
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
      meta: {
        errorHandler: (error: Error) => {
          handleAsyncError(error, "Failed to update data");
        }
      }
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="naijahub-theme">
        <Router>
          <AuthProvider>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-grow">
                  <Routes>
                    {mainRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                    {adminRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
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
              </div>
              <Toaster />
            </ErrorBoundary>
            
            {/* PWA components wrapped in their own error boundaries */}
            <ErrorBoundary fallback={<></>}>
              <Suspense fallback={<></>}>
                <InstallPrompt />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary fallback={<></>}>
              <Suspense fallback={<></>}>
                <OfflineIndicator />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
