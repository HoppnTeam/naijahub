
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { CardContent } from "@/components/ui/card";

interface DesignerInfoProps {
  description: string;
  specialties: string[];
  yearsExperience: number | null;
  rating: number;
  reviewCount: number;
}

export const DesignerInfo = ({
  description,
  specialties,
  yearsExperience,
  rating,
  reviewCount
}: DesignerInfoProps) => {
  return (
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="outline">
                {specialty.replace('_', ' ').toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>

        {yearsExperience && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{yearsExperience} years of experience</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
