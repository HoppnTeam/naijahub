
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { BasicInfoFields } from "@/components/beauty/registration/BasicInfoFields";
import { ContactInfoFields } from "@/components/beauty/registration/ContactInfoFields";
import { SpecialtiesFields } from "@/components/beauty/registration/SpecialtiesFields";
import { beautyProfessionalFormSchema, type BeautyProfessionalFormValues } from "@/schemas/beauty-professional";

const BeautyProfessionalRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BeautyProfessionalFormValues>({
    resolver: zodResolver(beautyProfessionalFormSchema),
    defaultValues: {
      business_name: "",
      description: "",
      years_experience: 0,
      location: "",
      contact_email: "",
      contact_phone: "",
      instagram_handle: "",
      website: "",
      specialties: [],
      professional_type: "hair_stylist",
    },
  });

  const onSubmit = async (values: BeautyProfessionalFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Upload portfolio images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `beauty-portfolios/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Create professional profile
      const { error } = await supabase
        .from("beauty_professional_portfolios")
        .insert({
          business_name: values.business_name,
          description: values.description,
          years_experience: values.years_experience,
          location: values.location,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          instagram_handle: values.instagram_handle,
          website: values.website || null,
          specialties: values.specialties,
          professional_type: values.professional_type,
          portfolio_images: imageUrls,
          user_id: user.id,
          rating: 0,
          review_count: 0,
          verified: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your professional profile has been created",
      });

      navigate("/categories/fashion-beauty/beauty-professionals");
    } catch (error) {
      console.error("Error creating professional profile:", error);
      toast({
        title: "Error",
        description: "Failed to create professional profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Please sign in to register as a beauty professional.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Register as a Beauty Professional</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoFields form={form} />

          <div className="space-y-4">
            <FormLabel>Portfolio Images</FormLabel>
            <ImageUpload
              onImagesChange={setImages}
              maxFiles={5}
              accept="image/*"
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Contact Information</FormLabel>
            <ContactInfoFields form={form} />
          </div>

          <SpecialtiesFields form={form} />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Profile..." : "Create Professional Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BeautyProfessionalRegistration;
