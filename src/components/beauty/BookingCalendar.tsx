
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { addDays, format, isAfter, isBefore, setHours, setMinutes } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock } from "lucide-react";

interface BookingCalendarProps {
  professionalId: string;
  onTimeSlotSelect: (date: Date, startTime: string, endTime: string) => void;
}

export const BookingCalendar = ({ professionalId, onTimeSlotSelect }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: ['professional-availability', professionalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beauty_professional_availability')
        .select('*')
        .eq('professional_id', professionalId);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: blockedDates } = useQuery({
    queryKey: ['professional-blocked-dates', professionalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beauty_professional_blocked_dates')
        .select('date')
        .eq('professional_id', professionalId);
      
      if (error) throw error;
      return data.map(d => new Date(d.date));
    }
  });

  const { data: existingBookings } = useQuery({
    queryKey: ['professional-bookings', professionalId, selectedDate],
    enabled: !!selectedDate,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beauty_professional_bookings')
        .select('start_time, end_time')
        .eq('professional_id', professionalId)
        .eq('booking_date', format(selectedDate!, 'yyyy-MM-dd'))
        .neq('status', 'cancelled');
      
      if (error) throw error;
      return data;
    }
  });

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !availability) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
    
    if (!dayAvailability) return [];

    const bookedSlots = existingBookings || [];
    const timeSlots: { startTime: string; endTime: string }[] = [];

    dayAvailability.time_slots.forEach(slot => {
      const [startHour, startMinute] = slot.start_time.split(':').map(Number);
      const [endHour, endMinute] = slot.end_time.split(':').map(Number);
      
      // Create 1-hour slots
      let currentTime = setMinutes(setHours(selectedDate, startHour), startMinute);
      const endTime = setMinutes(setHours(selectedDate, endHour), endMinute);

      while (isBefore(currentTime, endTime)) {
        const slotEndTime = addDays(currentTime, 0);
        slotEndTime.setHours(currentTime.getHours() + 1);

        const isBooked = bookedSlots.some(booking => {
          const bookingStart = new Date(`1970-01-01T${booking.start_time}`);
          const bookingEnd = new Date(`1970-01-01T${booking.end_time}`);
          return (
            !isAfter(bookingStart, slotEndTime) && 
            !isBefore(bookingEnd, currentTime)
          );
        });

        if (!isBooked) {
          timeSlots.push({
            startTime: format(currentTime, 'HH:mm'),
            endTime: format(slotEndTime, 'HH:mm')
          });
        }

        currentTime = slotEndTime;
      }
    });

    return timeSlots;
  };

  const timeSlots = selectedDate ? getAvailableTimeSlots() : [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => 
            date < new Date() || // Past dates
            (blockedDates?.some(blocked => 
              format(blocked, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            ) ?? false)
          }
          className="rounded-md border"
        />
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Available Time Slots</h3>
        {!selectedDate ? (
          <p className="text-muted-foreground">Please select a date to view available time slots</p>
        ) : loadingAvailability ? (
          <p>Loading availability...</p>
        ) : timeSlots.length === 0 ? (
          <p className="text-muted-foreground">No available time slots for this date</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map(({ startTime, endTime }, index) => (
              <button
                key={index}
                onClick={() => onTimeSlotSelect(selectedDate, startTime, endTime)}
                className="flex items-center gap-2 p-2 border rounded hover:bg-primary/5 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>
                  {startTime} - {endTime}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
