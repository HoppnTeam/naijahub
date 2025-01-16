import * as z from "zod";

export const workshopSchema = z.object({
  name: z.string().min(3, "Workshop name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  workshop_type: z.enum([
    "mechanic",
    "auto_electrician",
    "panel_beater",
    "tire_service",
    "car_wash",
    "diagnostics_center",
    "spare_parts",
    "general_service"
  ]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  phone_number: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal(""))
});

export type WorkshopFormValues = z.infer<typeof workshopSchema>;