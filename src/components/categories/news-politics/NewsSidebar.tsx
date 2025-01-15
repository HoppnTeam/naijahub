import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Category {
  id: string;
  name: string;
}

interface NewsSidebarProps {
  subcategories?: Category[];
  onSubcategorySelect?: (subcategoryId: string | null) => void;
}

export const NewsSidebar = ({ subcategories, onSubcategorySelect }: NewsSidebarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSubcategory = searchParams.get('subcategory');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            key="all"
            variant={!currentSubcategory ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSubcategorySelect?.(null)}
          >
            All News
          </Button>
          {subcategories?.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant={currentSubcategory === subcategory.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSubcategorySelect?.(subcategory.id)}
            >
              {subcategory.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Contributors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Most Active Users</span>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
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
              Technology
            </Button>
            <Button variant="outline" size="sm">
              Business
            </Button>
            <Button variant="outline" size="sm">
              International
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};