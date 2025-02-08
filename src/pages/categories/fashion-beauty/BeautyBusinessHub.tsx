
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Store, 
  Users, 
  Scissors,
  ShoppingBag,
  LineChart
} from "lucide-react";

const BeautyBusinessHub = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Beauty Business Hub</h1>
        <p className="text-muted-foreground">
          Manage your beauty business, connect with clients, and grow your brand
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/categories/fashion-beauty/beauty-professionals/register")}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Beauty Professional</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Register as a beauty professional and showcase your services
          </p>
          <Button variant="secondary" className="w-full">Get Started</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/categories/fashion-beauty/designer-register")}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Fashion Designer</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Join our designer community and connect with potential clients
          </p>
          <Button variant="secondary" className="w-full">Register Now</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/categories/fashion-beauty/business-hub/dashboard")}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <LineChart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Business Dashboard</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Track your business performance and manage appointments
          </p>
          <Button variant="secondary" className="w-full">View Dashboard</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Find Professionals</h3>
              <p className="text-muted-foreground">
                Browse our directory of verified beauty professionals
              </p>
            </div>
          </div>
          <Button 
            className="w-full"
            onClick={() => navigate("/categories/fashion-beauty/beauty-professionals")}
          >
            Browse Professionals
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Designer Directory</h3>
              <p className="text-muted-foreground">
                Discover talented fashion designers in your area
              </p>
            </div>
          </div>
          <Button 
            className="w-full"
            onClick={() => navigate("/categories/fashion-beauty/designer-directory")}
          >
            Find Designers
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BeautyBusinessHub;
