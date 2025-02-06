import NewsAndPolitics from "@/pages/categories/NewsAndPolitics";
import Entertainment from "@/pages/categories/Entertainment";
import Technology from "@/pages/categories/Technology";
import Sports from "@/pages/categories/Sports";
import Business from "@/pages/categories/Business";
import Health from "@/pages/categories/Health";
import Agriculture from "@/pages/categories/Agriculture";
import Travel from "@/pages/categories/Travel";
import Culture from "@/pages/categories/Culture";
import Automotive from "@/pages/categories/Automotive";
import { AutomotiveCreatePost } from "@/components/posts/automotive/AutomotiveCreatePost";
import { RouteObject } from "react-router-dom";
import ContentGuidelines from "@/pages/ContentGuidelines";

export const categoryRoutes: RouteObject[] = [
  { path: "/categories/news-politics", element: <NewsAndPolitics /> },
  { path: "/categories/entertainment", element: <Entertainment /> },
  { path: "/categories/technology", element: <Technology /> },
  { path: "/categories/sports", element: <Sports /> },
  { path: "/categories/business", element: <Business /> },
  { path: "/categories/health", element: <Health /> },
  { path: "/categories/agriculture", element: <Agriculture /> },
  { path: "/categories/travel", element: <Travel /> },
  { path: "/categories/culture", element: <Culture /> },
  { path: "/categories/automotive", element: <Automotive /> },
  { path: "/categories/automotive/create", element: <AutomotiveCreatePost /> },
  { path: "/content-guidelines", element: <ContentGuidelines /> }
];
