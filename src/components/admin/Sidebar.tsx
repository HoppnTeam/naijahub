import { LayoutDashboard, Users, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="w-64 bg-background border-r h-screen p-4">
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/admin/posts"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span>Posts</span>
        </NavLink>
      </nav>
    </div>
  );
};