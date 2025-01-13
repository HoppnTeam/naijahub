import { useNavigate } from "react-router-dom";
import { UserMenu } from "./UserMenu";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-primary py-4">
      <div className="container flex items-center justify-between">
        <h1 
          onClick={() => navigate("/")} 
          className="text-2xl font-bold text-white cursor-pointer"
        >
          NaijaHub
        </h1>
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};