import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserDetailsTab } from "./UserDetailsTab";
import { UserActivityTab } from "./UserActivityTab";
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "@/types/profile";

type UserRole = Database["public"]["Enums"]["user_role"];

interface UserProfileModalProps {
  user: Profile;
  onClose: () => void;
}

export function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("user_id", user.user_id);

      if (error) throw error;

      await supabase.from("user_activity_logs").insert({
        user_id: user.user_id,
        action: `status_changed_to_${newStatus}`,
        details: { previous_status: user.status },
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: user.user_id, 
          role: newRole 
        });

      if (error) throw error;

      await supabase.from("user_activity_logs").insert({
        user_id: user.user_id,
        action: `role_changed_to_${newRole}`,
        details: { previous_role: user.user_roles?.[0]?.role },
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", user.user_id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const { data: activities, isLoading } = useQuery({
    queryKey: ["user-activities", user.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("user_id", user.user_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Profile: {user.username}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <UserDetailsTab
              user={user}
              isUpdating={isUpdating}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isUpdating}
              >
                Delete User
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <UserActivityTab activities={activities} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}