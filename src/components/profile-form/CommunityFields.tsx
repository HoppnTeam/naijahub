import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./types";

interface CommunityFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function CommunityFields({ form }: CommunityFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="community_intent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Goals</FormLabel>
            <FormControl>
              <Textarea
                placeholder="What do you hope to achieve in our community?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Interests</FormLabel>
            <FormControl>
              <Input 
                placeholder="Technology, Sports, Music (comma-separated)"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Enter your interests separated by commas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}