import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { BasicInfoFields } from "./profile-form/BasicInfoFields"
import { ContactFields } from "./profile-form/ContactFields"
import { CommunityFields } from "./profile-form/CommunityFields"
import { profileFormSchema, type ProfileFormValues } from "./profile-form/types"

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
        <div className="space-y-4">
          <BasicInfoFields form={form} />
          <ContactFields form={form} />
          <CommunityFields form={form} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  )
}