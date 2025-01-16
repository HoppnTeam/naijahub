import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { WorkshopTypeField } from "./form/WorkshopTypeField";
import { LocationFields } from "./form/LocationFields";
import { ContactFields } from "./form/ContactFields";
import { workshopSchema, type WorkshopFormValues } from "./form/WorkshopFormSchema";

export const AddWorkshopForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      name: "",
      description: "",
      workshop_type: "mechanic",
      address: "",
      city: "",
      state: "",
      phone_number: "",
      email: "",
      website: "",
    },
  });

  const onSubmit = async (values: WorkshopFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("automotive_workshops")
        .insert({
          ...values,
          user_id: user.id,
          rating: 0,
          review_count: 0,
          verified: false,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Workshop has been added successfully",
      });

      form.reset();
    } catch (error) {
      console.error("Error adding workshop:", error);
      toast({
        title: "Error",
        description: "Failed to add workshop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields />
        <WorkshopTypeField />
        <LocationFields />
        <ContactFields />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Workshop..." : "Add Workshop"}
        </Button>
      </form>
    </Form>
  );
};