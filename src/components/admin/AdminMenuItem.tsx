import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const AdminMenuItem = () => {
  const navigate = useNavigate();
  const { checkAdminStatus } = useAuth();
  
  const handleAdminNavigation = async () => {
    // This will refresh the admin status before navigating
    await checkAdminStatus();
    // Directly navigate to admin dashboard without going through sign-in
    navigate("/admin");
  };
  
  return (
    <DropdownMenuItem 
      onClick={handleAdminNavigation}
      className="cursor-pointer flex items-center"
    >
      <LayoutDashboard className="mr-2 h-4 w-4" />
      <span>Admin Dashboard</span>
    </DropdownMenuItem>
  );
};