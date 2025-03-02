import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Profile } from "@/types/profile";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItemsProps {
  userId: string;
  profile: Profile | null;
  onSignOut: () => Promise<void>;
}

export const MenuItems = ({ userId, profile, onSignOut }: MenuItemsProps) => {
  const navigate = useNavigate();
  const { isAdmin, checkAdminStatus } = useAuth();
  
  // Check admin status when component mounts or profile changes
  useEffect(() => {
    if (profile && profile.user_roles) {
      checkAdminStatus();
    }
  }, [profile, checkAdminStatus]);

  return (
    <>
      <DropdownMenuItem 
        onClick={() => navigate(`/profile/${userId}`)}
        className="cursor-pointer flex items-center"
      >
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      
      {isAdmin && (
        <DropdownMenuItem 
          onClick={() => navigate("/admin")}
          className="cursor-pointer flex items-center"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Admin Dashboard</span>
        </DropdownMenuItem>
      )}
      
      <DropdownMenuItem 
        onClick={onSignOut}
        className="cursor-pointer flex items-center text-red-600 focus:text-red-600"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign Out</span>
      </DropdownMenuItem>
    </>
  );
};