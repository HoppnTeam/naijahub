import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import CreatePost from "@/pages/CreatePost";
import PostDetails from "@/pages/PostDetails";
import Advertise from "@/pages/Advertise";
import Contact from "@/pages/Contact";
import { RouteObject } from "react-router-dom";

export const mainRoutes: RouteObject[] = [
  { path: "/", element: <Index /> },
  { path: "/auth", element: <Auth /> },
  { path: "/profile/:id", element: <Profile /> },
  { path: "/create-post", element: <CreatePost /> },
  { path: "/posts/:id", element: <PostDetails /> },
  { path: "/advertise", element: <Advertise /> },
  { path: "/contact", element: <Contact /> }
];