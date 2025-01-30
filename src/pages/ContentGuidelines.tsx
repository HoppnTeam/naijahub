import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense } from "react";

const ContentGuidelines = () => {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 px-4">Loading...</div>}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">NaijaHub Content Guidelines</h1>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-lg text-muted-foreground mb-4">
              Welcome to NaijaHub's Content Guidelines. These guidelines are designed to ensure our community remains 
              respectful, informative, and valuable for all Nigerians worldwide.
            </p>
          </CardContent>
        </Card>

        <ScrollArea className="h-[600px] rounded-md border p-6">
        <div className="space-y-8">
          {/* General Principles */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">General Principles</h2>
            <Separator className="mb-4" />
            <ul className="space-y-3 text-muted-foreground">
              <li>• Be respectful and constructive in all interactions</li>
              <li>• Maintain the cultural values and dignity of Nigeria</li>
              <li>• Verify information before posting to prevent misinformation</li>
              <li>• Use clear, concise language that everyone can understand</li>
            </ul>
          </section>

          {/* Prohibited Content */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Prohibited Content</h2>
            <Separator className="mb-4" />
            <ul className="space-y-3 text-muted-foreground">
              <li>• Hate speech, tribal slurs, or discriminatory content</li>
              <li>• Explicit adult content or pornographic material</li>
              <li>• Violence or graphic content</li>
              <li>• Spam, scams, or fraudulent content</li>
              <li>• Unauthorized advertising or self-promotion</li>
              <li>• Content that violates Nigerian laws</li>
            </ul>
          </section>

          {/* Category-Specific Guidelines */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Category-Specific Guidelines</h2>
            <Separator className="mb-4" />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">News & Politics</h3>
                <p className="text-muted-foreground">Share verified news from reliable sources. Avoid sensationalism and political propaganda.</p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Marketplace</h3>
                <p className="text-muted-foreground">Provide accurate product descriptions and fair pricing. No counterfeit goods.</p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Culture & Entertainment</h3>
                <p className="text-muted-foreground">Celebrate Nigerian culture respectfully. Credit original content creators.</p>
              </div>
            </div>
          </section>

          {/* Moderation & Enforcement */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Moderation & Enforcement</h2>
            <Separator className="mb-4" />
            <div className="space-y-3 text-muted-foreground">
              <p>Our moderation team works to maintain these guidelines through:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Content review and removal if necessary</li>
                <li>Warning system for minor violations</li>
                <li>Temporary or permanent account suspension for serious violations</li>
                <li>Appeal process for moderation decisions</li>
              </ul>
            </div>
          </section>

          {/* Community Reporting */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Community Reporting</h2>
            <Separator className="mb-4" />
            <div className="space-y-3 text-muted-foreground">
              <p>Help maintain our community standards by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Using the report button for content that violates guidelines</li>
                <li>Providing clear reasons when reporting content</li>
                <li>Not misusing the reporting system</li>
              </ul>
            </div>
          </section>

          {/* Updates & Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Updates & Changes</h2>
            <Separator className="mb-4" />
            <p className="text-muted-foreground">
              These guidelines may be updated periodically to reflect community needs and changing circumstances. 
              Users will be notified of significant changes.
            </p>
          </section>
        </div>
        </ScrollArea>
      </div>
    </Suspense>
  );
};

export default ContentGuidelines;
