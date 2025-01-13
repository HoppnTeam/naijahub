import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AgricultureSidebar = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Farmers' Corner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Join discussions on farming best practices and innovations
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => toast({
              title: "Coming Soon",
              description: "Farmers' Corner will be available soon!"
            })}
          >
            Join Discussion
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Agro Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Buy and sell agricultural products, seeds, and equipment
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => toast({
              title: "Coming Soon",
              description: "Marketplace features will be available soon!"
            })}
          >
            Visit Marketplace
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li>
              <Button 
                variant="link" 
                className="text-left w-full"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Training resources will be available soon!"
                })}
              >
                🌱 Agricultural Training Programs
              </Button>
            </li>
            <li>
              <Button 
                variant="link" 
                className="text-left w-full"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Grant information will be available soon!"
                })}
              >
                💰 Available Grants
              </Button>
            </li>
            <li>
              <Button 
                variant="link" 
                className="text-left w-full"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Expert consultations will be available soon!"
                })}
              >
                👨‍🌾 Expert Consultation
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};