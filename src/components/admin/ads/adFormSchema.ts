import { z } from "zod";

export const adFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tier: z.enum(["basic", "standard", "premium", "enterprise"]),
  placement: z.enum(["sidebar", "feed", "banner", "popup"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  image_url: z.string().optional(),
  status: z.string().default("pending"),
});

export type AdFormValues = z.infer<typeof adFormSchema>;