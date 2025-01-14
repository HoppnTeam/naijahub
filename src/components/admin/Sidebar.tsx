import { NavLink } from "react-router-dom";
import {
  ChartBar,
  Users,
  FileText,
  Flag,
  Settings,
  List,
} from "lucide-react";

const navigation = [
  { name: "Overview", to: "/admin", icon: ChartBar },
  { name: "Users", to: "/admin/users", icon: Users },
  { name: "Posts", to: "/admin/posts", icon: FileText },
  { name: "Reports", to: "/admin/reports", icon: Flag },
  { name: "Categories", to: "/admin/categories", icon: List },
  { name: "Settings", to: "/admin/settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-4 border-b">
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm rounded-md ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};