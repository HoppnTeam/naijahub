import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, Music, Star, Clapperboard, Video } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  description: string | null;
}

interface EntertainmentSidebarProps {
  subcategories?: Subcategory[];
}

export const EntertainmentSidebar = ({ subcategories }: EntertainmentSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {subcategories?.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant="ghost"
                className="w-full justify-start"
              >
                {getSubcategoryIcon(subcategory.name)}
                <span className="ml-2">{subcategory.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Celebrity Corner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <Star className="mr-2 h-4 w-4" />
              Top Celebrities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getSubcategoryIcon = (name: string) => {
  switch (name) {
    case "Music":
      return <Music className="h-4 w-4" />;
    case "Movies & TV":
      return <Clapperboard className="h-4 w-4" />;
    case "Celebrity News":
      return <Star className="h-4 w-4" />;
    default:
      return <Video className="h-4 w-4" />;
  }
};