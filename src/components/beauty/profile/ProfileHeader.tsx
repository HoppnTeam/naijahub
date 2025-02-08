
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { BeautyProfessional } from "@/types/beauty";

interface ProfileHeaderProps {
  professional: BeautyProfessional;
}

export const BeautyProfileHeader = ({ professional }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button 
        onClick={() => navigate("/categories/fashion-beauty/beauty-professionals")}
        variant="outline"
        className="mb-6"
      >
        Back to Directory
      </Button>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{professional.business_name}</h1>
          <p className="text-muted-foreground">{professional.location}</p>
        </div>
        {professional.verified && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Verified
          </span>
        )}
      </div>
    </div>
  );
};
