import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { LoadingFallback } from "@/components/ui/LoadingFallback";

// Lazy load all components
const NewsAndPolitics = lazy(() => import("@/pages/categories/NewsAndPolitics"));
const Entertainment = lazy(() => import("@/pages/categories/Entertainment"));
const Technology = lazy(() => import("@/pages/categories/Technology"));
const Sports = lazy(() => import("@/pages/categories/Sports"));
const Business = lazy(() => import("@/pages/categories/Business"));
const Health = lazy(() => import("@/pages/categories/Health"));
const Agriculture = lazy(() => import("@/pages/categories/Agriculture"));
const Travel = lazy(() => import("@/pages/categories/Travel"));
const Culture = lazy(() => import("@/pages/categories/Culture"));
const Automotive = lazy(() => import("@/pages/categories/Automotive"));
const FashionAndBeauty = lazy(() => import("@/pages/categories/fashion-beauty/FashionAndBeauty"));
const BeautyBusinessHub = lazy(() => import("@/pages/categories/fashion-beauty/business-hub/BeautyBusinessHub"));
const AutomotiveCreatePost = lazy(() => import("@/components/posts/automotive/AutomotiveCreatePost"));
const EntertainmentCreatePost = lazy(() => import("@/components/posts/entertainment/EntertainmentCreatePost"));
const FashionAndBeautyCreatePost = lazy(() => import("@/components/posts/fashion-beauty/FashionAndBeautyCreatePost"));
const TravelCreatePost = lazy(() => import("@/components/posts/travel/TravelCreatePost"));
const DesignerDirectory = lazy(() => import("@/pages/categories/fashion-beauty/DesignerDirectory"));
const DesignerRegistration = lazy(() => import("@/pages/categories/fashion-beauty/DesignerRegistration"));
const DesignerProfile = lazy(() => import("@/pages/categories/fashion-beauty/DesignerProfile"));
const BeautyProfessionalsDirectory = lazy(() => import("@/pages/categories/fashion-beauty/business-hub/BeautyProfessionalsDirectory"));
const BeautyProfessionalRegistration = lazy(() => import("@/pages/categories/fashion-beauty/business-hub/BeautyProfessionalRegistration"));
const BeautyProfessionalProfile = lazy(() => import("@/pages/categories/fashion-beauty/business-hub/BeautyProfessionalProfile"));
const BeautyBusinessDashboard = lazy(() => import("@/pages/categories/fashion-beauty/business-hub/BeautyBusinessDashboard"));

export const categoryRoutes: RouteObject[] = [
  { 
    path: "/categories/news-politics", 
    element: <Suspense fallback={<LoadingFallback />}><NewsAndPolitics /></Suspense> 
  },
  { 
    path: "/categories/entertainment", 
    element: <Suspense fallback={<LoadingFallback />}><Entertainment /></Suspense> 
  },
  { 
    path: "/categories/entertainment/create", 
    element: <Suspense fallback={<LoadingFallback />}><EntertainmentCreatePost /></Suspense> 
  },
  { 
    path: "/categories/technology", 
    element: <Suspense fallback={<LoadingFallback />}><Technology /></Suspense> 
  },
  { 
    path: "/categories/sports", 
    element: <Suspense fallback={<LoadingFallback />}><Sports /></Suspense> 
  },
  { 
    path: "/categories/business", 
    element: <Suspense fallback={<LoadingFallback />}><Business /></Suspense> 
  },
  { 
    path: "/categories/health", 
    element: <Suspense fallback={<LoadingFallback />}><Health /></Suspense> 
  },
  { 
    path: "/categories/agriculture", 
    element: <Suspense fallback={<LoadingFallback />}><Agriculture /></Suspense> 
  },
  { 
    path: "/categories/travel", 
    element: <Suspense fallback={<LoadingFallback />}><Travel /></Suspense> 
  },
  { 
    path: "/categories/travel/create", 
    element: <Suspense fallback={<LoadingFallback />}><TravelCreatePost /></Suspense> 
  },
  { 
    path: "/categories/culture", 
    element: <Suspense fallback={<LoadingFallback />}><Culture /></Suspense> 
  },
  { 
    path: "/categories/automotive", 
    element: <Suspense fallback={<LoadingFallback />}><Automotive /></Suspense> 
  },
  { 
    path: "/categories/automotive/create", 
    element: <Suspense fallback={<LoadingFallback />}><AutomotiveCreatePost /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty", 
    element: <Suspense fallback={<LoadingFallback />}><FashionAndBeauty /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/create", 
    element: <Suspense fallback={<LoadingFallback />}><FashionAndBeautyCreatePost /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/business-hub", 
    element: <Suspense fallback={<LoadingFallback />}><BeautyBusinessHub /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/business-hub/dashboard", 
    element: <Suspense fallback={<LoadingFallback />}><BeautyBusinessDashboard /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/designer-directory", 
    element: <Suspense fallback={<LoadingFallback />}><DesignerDirectory /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/designer-register", 
    element: <Suspense fallback={<LoadingFallback />}><DesignerRegistration /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/designers/:id", 
    element: <Suspense fallback={<LoadingFallback />}><DesignerProfile /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/business-hub/professionals", 
    element: <Suspense fallback={<LoadingFallback />}><BeautyProfessionalsDirectory /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/business-hub/professionals/register", 
    element: <Suspense fallback={<LoadingFallback />}><BeautyProfessionalRegistration /></Suspense> 
  },
  { 
    path: "/categories/fashion-beauty/business-hub/professionals/:id", 
    element: <Suspense fallback={<LoadingFallback />}><BeautyProfessionalProfile /></Suspense> 
  },
];
