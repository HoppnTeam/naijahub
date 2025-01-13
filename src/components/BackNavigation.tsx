import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const BackNavigation = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="mb-4 hover:bg-transparent"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
};