import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Cpu, Rocket } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface TechnologySidebarProps {
  subcategories?: Category[];
}

export const TechnologySidebar = ({ subcategories }: TechnologySidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {subcategories?.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant="ghost"
              className="w-full justify-start"
            >
              {subcategory.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Featured</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span>Latest Tech Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span>Hot in AI & ML</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              <span>Nigerian Startups</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Business
            </Button>
            <Button variant="outline" size="sm">
              Education
            </Button>
            <Button variant="outline" size="sm">
              Innovation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};