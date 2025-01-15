import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AdFeature = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <Check className="w-4 h-4 text-primary" />
    <span className="text-sm text-gray-600">{children}</span>
  </div>
);

const Advertise = () => {
  const pricingTiers = [
    {
      name: "Basic",
      price: { ngn: "₦25,000", usd: "$35" },
      description: "Perfect for small businesses and startups",
      features: [
        "Standard ad placement on category pages",
        "7 days duration",
        "Basic analytics",
        "Text and single image ads",
        "2 category targeting"
      ],
      categories: ["Technology", "Business", "Entertainment"],
      placement: "Sidebar and Bottom Section"
    },
    {
      name: "Premium",
      price: { ngn: "₦75,000", usd: "$100" },
      description: "Ideal for growing businesses and brands",
      features: [
        "Premium placement on homepage and category pages",
        "30 days duration",
        "Detailed performance analytics",
        "Rich media ads support",
        "5 category targeting",
        "Social media promotion"
      ],
      categories: ["All Categories"],
      placement: "Homepage Featured, Category Headers"
    },
    {
      name: "Enterprise",
      price: { ngn: "₦200,000", usd: "$270" },
      description: "For large organizations and nationwide campaigns",
      features: [
        "Premium placement across all pages",
        "90 days duration",
        "Advanced analytics dashboard",
        "Custom ad formats",
        "All category access",
        "Dedicated account manager",
        "Priority support"
      ],
      categories: ["All Categories + Premium Spots"],
      placement: "Premium Positions, Homepage Takeover Option"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advertise on NaijaHub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Reach millions of engaged Nigerians worldwide through strategic ad placement on Nigeria's premier community platform.
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary">{tier.price.ngn}</span>
                <span className="text-gray-500 ml-2">/ {tier.price.usd}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3">
                {tier.features.map((feature) => (
                  <AdFeature key={feature}>{feature}</AdFeature>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Available Categories:</h4>
                <p className="text-sm text-gray-600">{tier.categories.join(", ")}</p>
                <h4 className="font-semibold mb-2 mt-4">Placement:</h4>
                <p className="text-sm text-gray-600">{tier.placement}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/contact">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Custom Advertising */}
      <div className="bg-gray-50 rounded-xl p-8 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Custom Advertising Solutions</h2>
          <p className="text-gray-600">
            Need a tailored advertising solution? We'll work with you to create a custom package that meets your specific needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Custom Options Include:</h3>
            <ul className="space-y-3">
              <AdFeature>Sponsored Content Creation</AdFeature>
              <AdFeature>Event Promotion Packages</AdFeature>
              <AdFeature>Newsletter Sponsorship</AdFeature>
              <AdFeature>Custom Integration Solutions</AdFeature>
              <AdFeature>Multi-Platform Campaigns</AdFeature>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <p className="text-gray-600 mb-6">
              Contact our advertising team to discuss your custom requirements and get a tailored quote.
            </p>
            <Button className="w-full" asChild>
              <Link to="/contact">Contact Advertising Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;