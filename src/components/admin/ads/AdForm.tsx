import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AdFormSchema, adFormSchema } from "./adFormSchema";
import { BasicInfoFields } from "./BasicInfoFields";
import { DateFields } from "./DateFields";
import { PlacementFields } from "./PlacementFields";

interface AdFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    tier: "basic" | "standard" | "premium" | "enterprise";
    placement: "sidebar" | "feed" | "banner" | "popup";
    start_date: string;
    end_date: string;
    image_url?: string;
  };
}

export const AdForm = ({ initialData }: AdFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<AdFormSchema>({
    resolver: zodResolver(adFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      tier: "basic",
      placement: "sidebar",
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (values: AdFormSchema) => {
    try {
      const submissionData = {
        ...values,
        impression_count: 0,
        click_count: 0,
        status: "pending",
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("advertisements")
          .update(submissionData)
          .eq("id", initialData.id)
          .single();

        if (error) throw error;
        toast({
          title: "Advertisement updated",
          description: "Your advertisement has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("advertisements")
          .insert([submissionData])
          .single();

        if (error) throw error;
        toast({
          title: "Advertisement created",
          description: "Your advertisement has been created successfully.",
        });
      }

      navigate("/admin/ads");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfoFields form={form} />
        <PlacementFields form={form} />
        <DateFields form={form} />
        <Button type="submit">
          {initialData ? "Update Advertisement" : "Create Advertisement"}
        </Button>
      </form>
    </Form>
  );
};