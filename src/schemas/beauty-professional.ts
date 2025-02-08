
import * as z from "zod";
import { specialtiesList } from "@/constants/beauty-professionals";

export const beautyProfessionalFormSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  years_experience: z.number().min(0).optional(),
  location: z.string().min(2, "Location is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  instagram_handle: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  specialties: z.array(z.enum(specialtiesList)),
  professional_type: z.enum(specialtiesList)
});

export type BeautyProfessionalFormValues = z.infer<typeof beautyProfessionalFormSchema>;
