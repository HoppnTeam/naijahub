import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CultureSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Personal Ads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={() => navigate("/create-personal-ad")}
          >
            <Users className="mr-2 h-4 w-4" />
            Create Personal Ad
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Festivals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>New Yam Festival</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Durbar Festival</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Eyo Festival</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};