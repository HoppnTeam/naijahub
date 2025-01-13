import { z } from "zod";

export const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  location: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  phone_number: z.string().optional(),
  community_intent: z.string().optional(),
  interests: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;