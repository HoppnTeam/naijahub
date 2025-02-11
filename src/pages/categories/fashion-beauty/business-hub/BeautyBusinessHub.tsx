
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BeautyBusinessHub = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Beauty Business Hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Professional Directory</h2>
          <p className="mb-4">Browse and connect with beauty professionals.</p>
          <Button onClick={() => navigate("professionals")}>
            View Professionals
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Register as Professional</h2>
          <p className="mb-4">Create your professional profile and reach more clients.</p>
          <Button onClick={() => navigate("professionals/register")}>
            Register Now
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BeautyBusinessHub;
