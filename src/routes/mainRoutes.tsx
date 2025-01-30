import { lazy } from "react";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import CreatePost from "@/pages/CreatePost";
import PostDetails from "@/pages/PostDetails";
import Contact from "@/pages/Contact";
import Advertise from "@/pages/Advertise";
const ContentGuidelines = lazy(() => import("@/pages/ContentGuidelines"));

export const mainRoutes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
  {
    path: "/posts/:id",
    element: <PostDetails />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/advertise",
    element: <Advertise />,
  },
  {
    path: "/content-guidelines",
    element: <ContentGuidelines />,
  },
];