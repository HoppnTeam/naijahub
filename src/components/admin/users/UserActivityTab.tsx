import { format } from "date-fns";

interface Activity {
  id: string;
  action: string;
  created_at: string;
}

interface UserActivityTabProps {
  activities: Activity[];
  isLoading: boolean;
}

export const UserActivityTab = ({ activities, isLoading }: UserActivityTabProps) => {
  if (isLoading) {
    return <div>Loading activity log...</div>;
  }

  return (
    <div className="space-y-4">
      {activities?.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between border-b pb-2"
        >
          <div>
            <p className="text-sm font-medium">{activity.action}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(activity.created_at), "PPp")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};