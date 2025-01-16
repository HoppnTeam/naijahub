import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { adFormSchema, type AdFormValues } from "./adFormSchema";
import { BasicInfoFields } from "./BasicInfoFields";
import { PlacementFields } from "./PlacementFields";
import { DateFields } from "./DateFields";

interface AdFormProps {
  initialData?: AdFormValues & { id: string };
  onSuccess: () => void;
}

export function AdForm({ initialData, onSuccess }: AdFormProps) {
  const { toast } = useToast();
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      tier: "basic",
      placement: "sidebar",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      image_url: "",
      status: "pending",
    },
  });

  const onSubmit = async (values: AdFormValues) => {
    try {
      const submissionData = {
        ...values,
        impression_count: 0,
        click_count: 0,
        tier: values.tier,
        placement: values.placement,
        start_date: values.start_date,
        end_date: values.end_date,
        title: values.title,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("advertisements")
          .update(submissionData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast({
          title: "Advertisement updated",
          description: "The advertisement has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("advertisements")
          .insert(submissionData);
        if (error) throw error;
        toast({
          title: "Advertisement created",
          description: "The advertisement has been created successfully.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields form={form} />
        <PlacementFields form={form} />
        <DateFields form={form} />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Advertisement image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialData ? "Update Advertisement" : "Create Advertisement"}
        </Button>
      </form>
    </Form>
  );
}