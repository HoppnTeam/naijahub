
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDialog } from "@/components/beauty/BookingDialog";
import { AboutSection } from "@/components/beauty/profile/AboutSection";
import { ServicesSection } from "@/components/beauty/profile/ServicesSection";
import { ContactSection } from "@/components/beauty/profile/ContactSection";
import { RatingsSection } from "@/components/beauty/profile/RatingsSection";
import { BookingSection } from "@/components/beauty/profile/BookingSection";
import type { BeautyProfessional, BeautyProfessionalService } from "@/types/beauty";

interface ProfileContentProps {
  professional: BeautyProfessional;
  services: BeautyProfessionalService[];
  selectedService?: BeautyProfessionalService;
  isOwner: boolean;
  isBookingDialogOpen: boolean;
  onServiceSelect: (service: BeautyProfessionalService) => void;
  onBookingDialogClose: () => void;
  onProceedBooking: () => void;
  onTimeSlotSelect?: (date: Date, startTime: string, endTime: string) => void;
}

export const ProfileContent = ({
  professional,
  services,
  selectedService,
  isOwner,
  isBookingDialogOpen,
  onServiceSelect,
  onBookingDialogClose,
  onProceedBooking,
  onTimeSlotSelect = () => {}
}: ProfileContentProps) => {
  const handleViewServices = () => {
    document.querySelector('[value="services"]')?.setAttribute('data-state', 'active');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="p-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="book">Book Appointment</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <AboutSection professional={professional} />
            </TabsContent>

            <TabsContent value="services">
              <ServicesSection 
                professional={professional}
                services={services}
                onServiceSelect={onServiceSelect}
                isOwner={isOwner}
              />
            </TabsContent>

            <TabsContent value="book">
              <BookingSection 
                professional={professional}
                selectedService={selectedService}
                selectedDate={undefined}
                selectedStartTime={undefined}
                selectedEndTime={undefined}
                onTimeSlotSelect={onTimeSlotSelect}
                onProceedBooking={onProceedBooking}
                onViewServices={handleViewServices}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="space-y-6">
        <ContactSection professional={professional} />
        <RatingsSection professional={professional} />
      </div>

      {selectedService && (
        <BookingDialog
          isOpen={isBookingDialogOpen}
          onClose={onBookingDialogClose}
          professional={professional}
          selectedDate={undefined}
          selectedStartTime={undefined}
          selectedEndTime={undefined}
          service={selectedService}
        />
      )}
    </div>
  );
};
