import { useNavigate } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./theme/ThemeToggle";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-primary py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 
          onClick={() => navigate("/")} 
          className="text-2xl font-bold text-white cursor-pointer font-poppins"
        >
          NaijaHub
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};