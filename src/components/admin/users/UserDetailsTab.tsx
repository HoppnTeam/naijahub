import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "@/types/profile";

type UserRole = Database["public"]["Enums"]["user_role"];

interface UserDetailsTabProps {
  user: Profile;
  isUpdating: boolean;
  onStatusChange: (status: string) => Promise<void>;
  onRoleChange: (role: UserRole) => Promise<void>;
}

export const UserDetailsTab = ({
  user,
  isUpdating,
  onStatusChange,
  onRoleChange,
}: UserDetailsTabProps) => {
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm font-medium">Status</label>
        <Select
          value={user.status}
          onValueChange={onStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Role</label>
        <Select
          value={user.user_roles?.[0]?.role || "user"}
          onValueChange={onRoleChange}
          disabled={isUpdating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};