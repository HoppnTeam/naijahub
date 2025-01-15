import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LiveDiscussionToggleProps {
  isLive: boolean;
  onLiveChange: (checked: boolean) => void;
}

export const LiveDiscussionToggle = ({
  isLive,
  onLiveChange,
}: LiveDiscussionToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="live-discussion"
        checked={isLive}
        onCheckedChange={onLiveChange}
      />
      <Label htmlFor="live-discussion">Mark as Live Discussion</Label>
    </div>
  );
};