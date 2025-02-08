
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/posts/ImageUpload";
import { BasicInfoFields } from "@/components/beauty/registration/BasicInfoFields";
import { ContactInfoFields } from "@/components/beauty/registration/ContactInfoFields";
import { SpecialtiesFields } from "@/components/beauty/registration/SpecialtiesFields";
import { beautyProfessionalFormSchema, type BeautyProfessionalFormValues } from "@/schemas/beauty-professional";
import { useBeautyProfessionalRegistration } from "@/hooks/beauty/use-beauty-professional-registration";

const BeautyProfessionalRegistration = () => {
  const { user } = useAuth();
  const { images, setImages, isSubmitting, handleSubmit } = useBeautyProfessionalRegistration();

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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
