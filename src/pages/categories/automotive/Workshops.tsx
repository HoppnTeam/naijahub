import { BackNavigation } from "@/components/BackNavigation";
import WorkshopSearch from "@/components/workshops/WorkshopSearch";
import { Navigation } from "@/components/Navigation";

const Workshops = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <BackNavigation />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Workshops & Services</h1>
          <WorkshopSearch />
        </div>
      </div>
    </div>
  );
};

export default Workshops;