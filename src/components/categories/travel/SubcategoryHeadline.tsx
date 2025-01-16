import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubcategoryHeadlineProps {
  subcategoryName: string;
}

const getSubcategoryHeadline = (subcategoryName: string) => {
  const headlines: { [key: string]: { title: string; description: string } } = {
    "destination-guides": {
      title: "Share Your Nigerian Travel Guides",
      description: "Create detailed guides about destinations across Nigeria. Include must-visit spots, local customs, accommodation options, and practical tips for fellow travelers."
    },
    "travel-stories": {
      title: "Share Your Travel Adventures",
      description: "Tell us about your memorable journeys across Nigeria and beyond. Share personal experiences, cultural encounters, and the lessons learned along the way."
    },
    "overseas-travel": {
      title: "International Travel Resources",
      description: "Share visa application tips, embassy experiences, flight booking strategies, and advice for Nigerians planning to travel abroad."
    },
    "street-foods": {
      title: "Explore Local Cuisines",
      description: "Document your street food discoveries, recommend the best local spots, and share the stories behind Nigeria's diverse culinary traditions."
    },
    "travel-tips": {
      title: "Essential Travel Tips",
      description: "Share practical advice about transportation, accommodation, budgeting, safety, and cultural etiquette for traveling in Nigeria."
    }
  };
  return headlines[subcategoryName] || { title: "", description: "" };
};

export const SubcategoryHeadline = ({ subcategoryName }: SubcategoryHeadlineProps) => {
  const headline = getSubcategoryHeadline(subcategoryName);

  if (!headline.title) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{headline.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {headline.description}
        </p>
      </CardContent>
    </Card>
  );
};