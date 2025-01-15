import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubcategoriesListProps {
  subcategories?: { id: string; name: string }[];
  selectedSubcategoryId?: string;
  onSubcategorySelect: (id: string) => void;
}

export const SubcategoriesList = ({
  subcategories,
  selectedSubcategoryId,
  onSubcategorySelect,
}: SubcategoriesListProps) => {
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entertainment Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {subcategories.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant={
                selectedSubcategoryId === subcategory.id ? "default" : "outline"
              }
              onClick={() => onSubcategorySelect(subcategory.id)}
              className="justify-start"
            >
              {subcategory.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};