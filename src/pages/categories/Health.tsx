import { Tabs } from "@/components/ui/tabs";
import { BackNavigation } from "@/components/BackNavigation";
import { HealthHeader } from "@/components/categories/health/HealthHeader";
import { HealthTabsList } from "@/components/categories/health/HealthTabsList";
import { HealthContent } from "@/components/categories/health/HealthContent";
import { HealthSidebar } from "@/components/categories/health/HealthSidebar";

const Health = () => {
  return (
    <div className="container py-8">
      <BackNavigation />
      <div className="flex flex-col gap-6">
        <HealthHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <HealthTabsList />
              <HealthContent />
            </Tabs>
          </div>

          <HealthSidebar />
        </div>
      </div>
    </div>
  );
};

export default Health;