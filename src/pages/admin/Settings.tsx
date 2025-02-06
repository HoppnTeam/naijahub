import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackNavigation } from "@/components/BackNavigation";

export const Settings = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <BackNavigation />
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Admin settings and configuration options will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;