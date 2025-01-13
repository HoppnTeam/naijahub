import { Wheat } from "lucide-react";

export const AgricultureHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Wheat className="h-8 w-8 text-green-600" />
      <h1 className="text-3xl font-bold">Agriculture Hub</h1>
    </div>
  );
};