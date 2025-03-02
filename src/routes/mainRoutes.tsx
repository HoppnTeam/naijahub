import { lazy, Suspense } from "react";
import { LoadingFallback } from "@/components/ui/LoadingFallback";

// Lazy load all components
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Profile = lazy(() => import("@/pages/Profile"));
const Orders = lazy(() => import("@/pages/profile/Orders"));
const SavedItems = lazy(() => import("@/pages/profile/SavedItems"));
const CreatePost = lazy(() => import("@/pages/CreatePost"));
const PostDetails = lazy(() => import("@/pages/PostDetails"));
const Contact = lazy(() => import("@/pages/Contact"));
const Advertise = lazy(() => import("@/pages/Advertise"));
const ContentGuidelines = lazy(() => import("@/pages/ContentGuidelines"));
const MarketplaceListings = lazy(() => import("@/components/marketplace/MarketplaceListings"));

export const mainRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Index />
      </Suspense>
    ),
  },
  {
    path: "/auth",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: "/profile/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/profile/orders",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Orders />
      </Suspense>
    ),
  },
  {
    path: "/profile/saved",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SavedItems />
      </Suspense>
    ),
  },
  {
    path: "/create-post",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CreatePost />
      </Suspense>
    ),
  },
  {
    path: "/posts/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PostDetails />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: "/advertise",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Advertise />
      </Suspense>
    ),
  },
  {
    path: "/content-guidelines",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ContentGuidelines />
      </Suspense>
    ),
  },
  {
    path: "/marketplace",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MarketplaceListings />
      </Suspense>
    ),
  },
];
