
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  activity_date: string;
  activity_type: string;
  client_name: string;
  description: string;
  amount: number;
  status: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
              <div>
                <p className="font-medium">{activity.activity_type}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(activity.activity_date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦{activity.amount.toLocaleString()}</p>
                <p className={`text-sm ${
                  activity.status === "completed" ? "text-green-600" : 
                  activity.status === "pending" ? "text-yellow-600" : 
                  "text-red-600"
                }`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
