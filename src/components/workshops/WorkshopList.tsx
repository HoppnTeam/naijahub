import { Workshop } from '@/types/workshop';
import { WorkshopCard } from './WorkshopCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface WorkshopListProps {
  workshops: (Workshop & { distance?: number })[] | undefined;
  isLoading: boolean;
}

export const WorkshopList = ({ workshops, isLoading }: WorkshopListProps) => {
  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      <h2 className="text-lg font-semibold sticky top-0 bg-background z-10 py-2">
        Workshops within 50 kilometers {workshops?.length ? `(${workshops.length} found)` : ''}
      </h2>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : workshops?.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No workshops found within 50 kilometers of your location
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workshops?.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      )}
    </div>
  );
};