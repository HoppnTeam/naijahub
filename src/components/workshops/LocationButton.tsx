import { Button } from '@/components/ui/button';
import { Loader2, Navigation } from 'lucide-react';

interface LocationButtonProps {
  isLocating: boolean;
  onClick: () => void;
}

export const LocationButton = ({ isLocating, onClick }: LocationButtonProps) => {
  return (
    <div className="flex justify-center">
      <Button 
        onClick={onClick} 
        disabled={isLocating}
        className="w-full max-w-md"
      >
        {isLocating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting your location...
          </>
        ) : (
          <>
            <Navigation className="mr-2 h-4 w-4" />
            Find Workshops Near Me
          </>
        )}
      </Button>
    </div>
  );
};