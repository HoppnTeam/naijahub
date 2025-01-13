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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useState } from "react"

interface ProfileEditFormProps {
  initialData?: {
    username: string;
    bio?: string | null;
    location?: string | null;
    contact_email?: string | null;
    phone_number?: string | null;
    community_intent?: string | null;
    interests?: string[] | null;
    avatar_url?: string | null;
  };
  userId: string;
  onSuccess?: () => void;
}

export function ProfileEditForm({ initialData, userId, onSuccess }: ProfileEditFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}.${fileExt}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId)

      if (updateError) throw updateError

      queryClient.invalidateQueries({ queryKey: ["profile", userId] })
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

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
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={initialData?.avatar_url ?? undefined} alt={initialData?.username} />
              <AvatarFallback>
                {initialData?.username?.substring(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input 
                id="avatar" 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </div>
          </div>

          <BasicInfoFields form={form} />
          <ContactFields form={form} />
          <CommunityFields form={form} />
        </div>
        <Button type="submit" disabled={isUploading}>Save Changes</Button>
      </form>
    </Form>
  )
}