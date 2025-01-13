import { AgricultureHeader } from "@/components/categories/agriculture/AgricultureHeader";
import { AgriculturePosts } from "@/components/categories/agriculture/AgriculturePosts";
import { AgricultureSidebar } from "@/components/categories/agriculture/AgricultureSidebar";
import { BackNavigation } from "@/components/BackNavigation";

const Agriculture = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackNavigation />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AgricultureHeader />
          <AgriculturePosts />
        </div>
        <div>
          <AgricultureSidebar />
        </div>
      </div>
    </div>
  );
};

export default Agriculture;