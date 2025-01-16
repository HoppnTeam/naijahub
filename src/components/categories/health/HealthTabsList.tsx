import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Apple, Brain, Leaf, AlertCircle } from "lucide-react";

export const HealthTabsList = () => {
  return (
    <TabsList className="w-full justify-start mb-6">
      <TabsTrigger value="all">All Posts</TabsTrigger>
      <TabsTrigger value="fitness" className="gap-2">
        <Heart className="w-4 h-4" />
        Fitness
      </TabsTrigger>
      <TabsTrigger value="nutrition" className="gap-2">
        <Apple className="w-4 h-4" />
        Nutrition
      </TabsTrigger>
      <TabsTrigger value="mental-health" className="gap-2">
        <Brain className="w-4 h-4" />
        Mental Health
      </TabsTrigger>
      <TabsTrigger value="natural-remedies" className="gap-2">
        <Leaf className="w-4 h-4" />
        Natural Remedies
      </TabsTrigger>
      <TabsTrigger value="disease-alert" className="gap-2">
        <AlertCircle className="w-4 h-4" />
        Disease Alert
      </TabsTrigger>
    </TabsList>
  );
};