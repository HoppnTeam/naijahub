import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import type { WorkshopFormValues } from "./WorkshopFormSchema";

export const WorkshopTypeField = () => {
  const form = useFormContext<WorkshopFormValues>();

  return (
    <FormField
      control={form.control}
      name="workshop_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Workshop Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select workshop type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="mechanic">Mechanic</SelectItem>
              <SelectItem value="auto_electrician">Auto Electrician</SelectItem>
              <SelectItem value="panel_beater">Panel Beater</SelectItem>
              <SelectItem value="tire_service">Tire Service</SelectItem>
              <SelectItem value="car_wash">Car Wash</SelectItem>
              <SelectItem value="diagnostics_center">Diagnostics Center</SelectItem>
              <SelectItem value="spare_parts">Spare Parts</SelectItem>
              <SelectItem value="general_service">General Service</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};