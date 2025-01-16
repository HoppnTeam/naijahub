import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { WorkshopFormValues } from "./WorkshopFormSchema";

export const ContactFields = () => {
  const form = useFormContext<WorkshopFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (optional)</FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="Enter phone number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email (optional)</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter email address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website (optional)</FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder="Enter website URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};