import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSubcategoryIcon } from "./utils";

interface SubcategoryHeaderProps {
  name: string;
  description: string;
}

export const SubcategoryHeader = ({ name, description }: SubcategoryHeaderProps) => {
  return (
    <Card className="border-l-4 border-l-primary bg-muted/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getSubcategoryIcon(name)}
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};