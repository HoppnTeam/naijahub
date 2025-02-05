import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag } from "lucide-react";

export const AdminMenuItem = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <DropdownMenuItem 
        onClick={() => navigate("/admin")}
        className="cursor-pointer flex items-center"
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        <span>Admin Dashboard</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem 
        onClick={() => navigate("/admin/marketplace")}
        className="cursor-pointer flex items-center"
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        <span>Marketplace Management</span>
      </DropdownMenuItem>
    </>
  );
};