
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
import type { BeautyProfessionalSpecialty } from "@/types/beauty";

const specialties: BeautyProfessionalSpecialty[] = [
  'hair_stylist',
  'makeup_artist',
  'nail_technician',
  'esthetician',
  'barber',
  'lash_technician',
  'spa_therapist',
  'cosmetologist'
];

const formSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  years_experience: z.number().min(0).optional(),
  location: z.string().min(2, "Location is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  instagram_handle: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  specialties: z.array(z.enum(specialties)),
  professional_type: z.enum(specialties),
});

type FormValues = z.infer<typeof formSchema>;

const BeautyProfessionalRegistration = () => {
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
      professional_type: "hair_stylist",
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
        const filePath = `beauty-portfolios/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Create professional profile
      const { error } = await supabase.from("beauty_professional_portfolios").insert({
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
        professional_type: values.professional_type,
        portfolio_images: imageUrls,
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
            name="professional_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded-md"
                  >
                    {specialties.map((type) => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
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

          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialties</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2">
                    {specialties.map((specialty) => (
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Profile..." : "Create Professional Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BeautyProfessionalRegistration;
