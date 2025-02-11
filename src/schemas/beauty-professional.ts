
import * as z from "zod";
import type { BeautyProfessionalSpecialty } from "@/types/beauty";

// Type to match form values with database schema
export type BeautyProfessionalFormValues = {
  business_name: string;
  description: string;
  years_experience?: number;
  location: string;
  contact_email: string;
  contact_phone?: string;
  instagram_handle?: string;
  website?: string;
  specialties: BeautyProfessionalSpecialty[];
  professional_type: BeautyProfessionalSpecialty;
};

export const beautyProfessionalFormSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  years_experience: z.number().min(0).optional(),
  location: z.string().min(2, "Location is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  instagram_handle: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  specialties: z.array(z.string() as z.ZodType<BeautyProfessionalSpecialty>),
  professional_type: z.string() as z.ZodType<BeautyProfessionalSpecialty>
});
