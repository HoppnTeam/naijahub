import NewsAndPolitics from "@/pages/categories/NewsAndPolitics";
import Entertainment from "@/pages/categories/Entertainment";
import { EntertainmentCreatePost } from "@/components/posts/entertainment/EntertainmentCreatePost";
import Technology from "@/pages/categories/Technology";
import { TechnologyCreatePost } from "@/components/posts/technology/TechnologyCreatePost";
import Sports from "@/pages/categories/Sports";
import Business from "@/pages/categories/Business";
import { BusinessCategoryCreatePost } from "@/components/posts/business/BusinessCategoryCreatePost";
import Health from "@/pages/categories/Health";
import Agriculture from "@/pages/categories/Agriculture";
import { AgricultureCreatePost } from "@/components/posts/agriculture/AgricultureCreatePost";
import Travel from "@/pages/categories/Travel";
import { TravelCreatePost } from "@/components/posts/travel/TravelCreatePost";
import Culture from "@/pages/categories/Culture";
import Automotive from "@/pages/categories/Automotive";
import { AutomotiveCreatePost } from "@/components/posts/automotive/AutomotiveCreatePost";
import { RouteObject } from "react-router-dom";
import ContentGuidelines from "@/pages/ContentGuidelines";

export const categoryRoutes: RouteObject[] = [
  { path: "/categories/news-politics", element: <NewsAndPolitics /> },
  { path: "/categories/entertainment", element: <Entertainment /> },
  { path: "/categories/entertainment/create", element: <EntertainmentCreatePost /> },
  { path: "/categories/technology", element: <Technology /> },
  { path: "/categories/technology/create", element: <TechnologyCreatePost /> },
  { path: "/categories/sports", element: <Sports /> },
  { path: "/categories/business", element: <Business /> },
  { path: "/categories/business/create", element: <BusinessCategoryCreatePost /> },
  { path: "/categories/health", element: <Health /> },
  { path: "/categories/agriculture", element: <Agriculture /> },
  { path: "/categories/agriculture/create", element: <AgricultureCreatePost /> },
  { path: "/categories/travel", element: <Travel /> },
  { path: "/categories/travel/create", element: <TravelCreatePost /> },
  { path: "/categories/culture", element: <Culture /> },
  { path: "/categories/automotive", element: <Automotive /> },
  { path: "/categories/automotive/create", element: <AutomotiveCreatePost categoryId="automotive" /> },
  { path: "/content-guidelines", element: <ContentGuidelines /> }
];