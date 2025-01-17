import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const AdminMenuItem = () => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
      Admin Dashboard
    </DropdownMenuItem>
  );
};