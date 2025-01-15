import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasicJobInfo } from "./form/BasicJobInfo";
import { JobTypeLocation } from "./form/JobTypeLocation";
import { JobDetails } from "./form/JobDetails";

export const TechJobForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    description: "",
    requirements: "",
    job_type: "full_time",
    location_type: "remote",
    location: "",
    salary_range: "",
    skills: [] as string[],
    application_url: "",
  });

  const handleFieldChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to post a job",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("tech_jobs").insert([
        {
          ...formData,
          user_id: user.id,
          status: "active",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your job posting has been created",
      });
      
      navigate("/categories/technology");
    } catch (error) {
      console.error("Error creating job posting:", error);
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a Tech Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicJobInfo
            title={formData.title}
            companyName={formData.company_name}
            description={formData.description}
            requirements={formData.requirements}
            onFieldChange={handleFieldChange}
          />

          <JobTypeLocation
            jobType={formData.job_type}
            locationType={formData.location_type}
            location={formData.location}
            onFieldChange={handleFieldChange}
          />

          <JobDetails
            salaryRange={formData.salary_range}
            skills={formData.skills}
            applicationUrl={formData.application_url}
            onFieldChange={handleFieldChange}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};