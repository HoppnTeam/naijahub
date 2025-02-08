
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageUpload } from "@/components/posts/ImageUpload";

// Update the form schema to match database requirements
const formSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  years_experience: z.number().min(0).optional(),
  location: z.string().min(2, "Location is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  instagram_handle: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  specialties: z.array(z.enum(['traditional', 'contemporary', 'bridal', 'ready_to_wear', 'haute_couture', 'accessories', 'footwear'])),
});

type FormValues = z.infer<typeof formSchema>;

const DesignerRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Upload portfolio images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `designer-portfolios/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Create designer profile with proper typing
      const { error } = await supabase.from("fashion_designers").insert({
        user_id: user.id,
        business_name: values.business_name,
        description: values.description,
        years_experience: values.years_experience,
        location: values.location,
        contact_email: values.contact_email,
        contact_phone: values.contact_phone,
        instagram_handle: values.instagram_handle,
        website: values.website || null,
        specialties: values.specialties,
        portfolio_images: imageUrls,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your designer profile has been created",
      });

      navigate("/categories/fashion-beauty/designer-directory");
    } catch (error) {
      console.error("Error creating designer profile:", error);
      toast({
        title: "Error",
        description: "Failed to create designer profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Please sign in to register as a designer.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Register as a Fashion Designer</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Phone (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Profile..." : "Create Designer Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DesignerRegistration;
