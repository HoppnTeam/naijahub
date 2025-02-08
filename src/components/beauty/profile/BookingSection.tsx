
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingCalendar } from "@/components/beauty/BookingCalendar";
import type { BeautyProfessional, BeautyProfessionalService } from "@/types/beauty";

interface BookingSectionProps {
  professional: BeautyProfessional;
  selectedService?: BeautyProfessionalService;
  selectedDate?: Date;
  selectedStartTime?: string;
  selectedEndTime?: string;
  onTimeSlotSelect: (date: Date, startTime: string, endTime: string) => void;
  onProceedBooking: () => void;
  onViewServices: () => void;
}

export const BookingSection = ({
  professional,
  selectedService,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onTimeSlotSelect,
  onProceedBooking,
  onViewServices,
}: BookingSectionProps) => {
  if (!selectedService) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Please select a service first
        </p>
        <Button onClick={onViewServices}>
          View Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Selected Service</h3>
        <div className="flex items-center gap-2 mb-1">
          <p>{selectedService.service_name} - ₦{selectedService.price}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Duration: {selectedService.duration_minutes} minutes
        </p>
      </Card>

      <BookingCalendar
        professionalId={professional.id}
        onTimeSlotSelect={onTimeSlotSelect}
      />

      {selectedDate && selectedStartTime && selectedEndTime && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={onProceedBooking}
          >
            Proceed with Booking
          </Button>
        </div>
      )}
    </div>
  );
};
