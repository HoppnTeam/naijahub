
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProfileErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Alert variant="destructive">
        <AlertTitle>Professional not found</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">The beauty professional you're looking for could not be found.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/categories/fashion-beauty/beauty-professionals")}
          >
            Return to Directory
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
