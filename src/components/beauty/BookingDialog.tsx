
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { BeautyProfessionalService } from "@/types/beauty";
import { MapPin, Clock, CreditCard } from "lucide-react";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  professional: {
    id: string;
    business_name: string;
  };
  selectedDate?: Date;
  selectedStartTime?: string;
  selectedEndTime?: string;
  service: BeautyProfessionalService;
}

export const BookingDialog = ({
  isOpen,
  onClose,
  professional,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  service,
}: BookingDialogProps) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getServiceLocationLabel = (location: string) => {
    switch (location) {
      case 'in_store':
        return 'In-Store Service';
      case 'home_service':
        return 'Home Service';
      case 'both':
        return 'In-Store or Home Service Available';
      default:
        return location;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Error",
          description: "Please sign in to book an appointment",
          variant: "destructive",
        });
        return;
      }

      const { error: bookingError } = await supabase
        .from("beauty_professional_bookings")
        .insert({
          professional_id: professional.id,
          client_id: user.id,
          service_id: service.id,
          booking_date: format(selectedDate!, "yyyy-MM-dd"),
          start_time: selectedStartTime,
          end_time: selectedEndTime,
          notes,
        });

      if (bookingError) throw bookingError;

      toast({
        title: "Success",
        description: "Your booking request has been submitted",
      });

      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Book an appointment with {professional.business_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <strong>Service Location:</strong>{" "}
                {getServiceLocationLabel(service.service_location)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <strong>Duration:</strong> {service.duration_minutes} minutes
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <strong>Price:</strong> ₦{service.price}
              </div>
            </div>

            <div>
              <strong>Date:</strong>{" "}
              {selectedDate ? format(selectedDate, "MMMM do, yyyy") : ""}
            </div>
            
            <div>
              <strong>Time:</strong> {selectedStartTime} - {selectedEndTime}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes">Additional Notes</label>
            <Textarea
              id="notes"
              placeholder="Any special requests or notes for the professional..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
