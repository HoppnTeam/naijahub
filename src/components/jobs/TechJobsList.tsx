import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TechJobForm } from "./TechJobForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TechJob } from "@/types/job";
import { JobFilters } from "./filters/JobFilters";
import { JobList } from "./JobList";

export const TechJobsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch local jobs
  const { data: localJobs, isLoading: isLoadingLocal } = useQuery<TechJob[]>({
    queryKey: ["tech-jobs", selectedType, selectedLocation, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("tech_jobs")
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq("status", "active");

      if (selectedType !== "all") {
        query = query.eq("job_type", selectedType);
      }

      if (selectedLocation !== "all") {
        query = query.eq("location_type", selectedLocation);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch external jobs
  const { data: externalJobs, isLoading: isLoadingExternal } = useQuery<TechJob[]>({
    queryKey: ["external-tech-jobs", selectedType, selectedLocation, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("external_tech_jobs")
        .select("*");

      if (selectedType !== "all") {
        query = query.eq("job_type", selectedType);
      }

      if (selectedLocation !== "all") {
        query = query.eq("location_type", selectedLocation);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform external jobs to match TechJob interface
      return (data || []).map(job => ({
        ...job,
        user_id: '', // External jobs don't have a user_id
        status: 'active', // All fetched external jobs are considered active
        profiles: null
      }));
    },
  });

  // Combine and sort all jobs by date
  const allJobs = [...(localJobs || []), ...(externalJobs || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleCreateClick = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to post a job",
        variant: "destructive",
      });
    }
  };

  const isLoading = isLoadingLocal || isLoadingExternal;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <JobFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          selectedLocation={selectedLocation}
          onSearchChange={setSearchQuery}
          onTypeChange={setSelectedType}
          onLocationChange={setSelectedLocation}
        />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleCreateClick}>Post a Job</Button>
          </DialogTrigger>
          {user && (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <TechJobForm />
            </DialogContent>
          )}
        </Dialog>
      </div>

      <JobList jobs={allJobs} isLoading={isLoading} />
    </div>
  );
};