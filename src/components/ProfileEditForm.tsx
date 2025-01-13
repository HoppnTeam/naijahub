import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  location: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  phone_number: z.string().optional(),
  community_intent: z.string().optional(),
  interests: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileEditFormProps {
  initialData?: {
    username: string;
    bio?: string | null;
    location?: string | null;
    contact_email?: string | null;
    phone_number?: string | null;
    community_intent?: string | null;
    interests?: string[] | null;
  };
  userId: string;
  onSuccess?: () => void;
}

export function ProfileEditForm({ initialData, userId, onSuccess }: ProfileEditFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: initialData?.username || "",
      bio: initialData?.bio || "",
      location: initialData?.location || "",
      contact_email: initialData?.contact_email || "",
      phone_number: initialData?.phone_number || "",
      community_intent: initialData?.community_intent || "",
      interests: initialData?.interests?.join(", ") || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...data,
          interests: data.interests ? data.interests.split(",").map(i => i.trim()) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      queryClient.invalidateQueries({ queryKey: ["profile", userId] })
      onSuccess?.()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  {...field}
                />
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
                <Input placeholder="Your location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="community_intent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Goals</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do you hope to achieve in our community?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Technology, Sports, Music (comma-separated)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your interests separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  )
}