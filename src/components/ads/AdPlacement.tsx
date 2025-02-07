
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdPlacementProps {
  type: "sidebar" | "feed" | "banner";
  className?: string;
}

const AdPlacement = ({ type, className }: AdPlacementProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden",
      type === "sidebar" && "mb-6",
      type === "feed" && "my-6",
      type === "banner" && "w-full mb-6",
      className
    )}>
      <CardContent className="p-4">
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
          Ad
        </Badge>
        <div className={cn(
          "bg-muted rounded-lg flex items-center justify-center",
          type === "sidebar" && "h-[250px]",
          type === "feed" && "h-[120px]",
          type === "banner" && "h-[90px]"
        )}>
          <p className="text-sm text-muted-foreground">
            Advertisement Space
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPlacement;
