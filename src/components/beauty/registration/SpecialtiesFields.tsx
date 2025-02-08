
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import type { BeautyProfessionalFormValues } from "@/schemas/beauty-professional";
import { specialtiesList } from "@/constants/beauty-professionals";

interface SpecialtiesFieldsProps {
  form: UseFormReturn<BeautyProfessionalFormValues>;
}

export const SpecialtiesFields = ({ form }: SpecialtiesFieldsProps) => {
  return (
    <FormField
      control={form.control}
      name="specialties"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Specialties</FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-2">
              {specialtiesList.map((specialty) => (
                <label key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.value.includes(specialty)}
                    onChange={(e) => {
                      const value = field.value || [];
                      if (e.target.checked) {
                        field.onChange([...value, specialty]);
                      } else {
                        field.onChange(value.filter((v) => v !== specialty));
                      }
                    }}
                    className="form-checkbox"
                  />
                  <span>{specialty.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
