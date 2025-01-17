import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AdminMenuItem } from "@/components/admin/AdminMenuItem";
import type { Profile } from "@/types/profile";

interface MenuItemsProps {
  userId: string;
  profile: Profile | null;
  onSignOut: () => Promise<void>;
}

export const MenuItems = ({ userId, profile, onSignOut }: MenuItemsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenuItem 
        onClick={() => navigate(`/profile/${userId}`)}
        className="cursor-pointer flex items-center"
      >
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      
      {profile?.user_roles?.[0]?.role === "admin" && <AdminMenuItem />}
      
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