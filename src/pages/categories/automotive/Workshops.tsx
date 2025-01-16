import { BackNavigation } from "@/components/BackNavigation";
import WorkshopSearch from "@/components/workshops/WorkshopSearch";

const Workshops = () => {
  return (
    <div className="container mx-auto py-8">
      <BackNavigation />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Workshops & Services</h1>
        <WorkshopSearch />
      </div>
    </div>
  );
};

export default Workshops;