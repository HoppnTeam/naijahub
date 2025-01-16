import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const HealthHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAskProfessional = () => {
    toast({
      title: "Coming Soon",
      description: "The Ask a Professional feature will be available soon!",
    });
  };

  const handleCreatePost = () => {
    navigate("/create-post", {
      state: { category: "Health" },
    });
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Health Hub</h1>
      <div className="space-x-4">
        <Button onClick={handleAskProfessional}>Ask a Professional</Button>
        <Button onClick={handleCreatePost}>Create Post</Button>
      </div>
    </div>
  );
};