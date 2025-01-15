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

  // Trigger external jobs fetch
  const { isLoading: isFetchingExternal } = useQuery({
    queryKey: ["trigger-external-jobs-fetch"],
    queryFn: async () => {
      const response = await fetch('https://ejltrhkhsvdtpxkhbher.supabase.co/functions/v1/fetch-external-jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch external jobs');
      }
      return response.json();
    },
    // Only fetch once when component mounts
    staleTime: Infinity,
    retry: 1,
  });

  // Fetch local jobs
  const { data: localJobs, isLoading: isLoadingLocal } = useQuery({
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
      if (error) {
        console.error("Error fetching local jobs:", error);
        throw error;
      }
      return data || [];
    },
  });

  // Fetch external jobs
  const { data: externalJobs, isLoading: isLoadingExternal } = useQuery({
    queryKey: ["external-tech-jobs", selectedType, selectedLocation, searchQuery],
    queryFn: async () => {
      const { data: jobs, error } = await supabase
        .from("external_tech_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching external jobs:", error);
        throw error;
      }

      // Transform external jobs to match TechJob interface
      return (jobs || []).map(job => ({
        ...job,
        user_id: '', // External jobs don't have a user_id
        status: 'active', // All fetched external jobs are considered active
        profiles: null,
        // Ensure all required TechJob fields are present
        job_type: job.job_type?.toLowerCase() || 'full_time',
        location_type: job.location_type?.toLowerCase() || 'onsite',
        location: job.location || 'Nigeria',
        skills: job.skills || []
      })) as TechJob[];
    },
    enabled: !isFetchingExternal, // Only fetch after external jobs are synced
  });

  // Combine and sort all jobs by date
  const allJobs = [...(localJobs || []), ...(externalJobs || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Filter combined jobs based on search and filters
  const filteredJobs = allJobs.filter(job => {
    const matchesType = selectedType === "all" || job.job_type?.toLowerCase() === selectedType.toLowerCase();
    const matchesLocation = selectedLocation === "all" || job.location_type?.toLowerCase() === selectedLocation.toLowerCase();
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesLocation && matchesSearch;
  });

  const handleCreateClick = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to post a job",
        variant: "destructive",
      });
    }
  };

  const isLoading = isLoadingLocal || isLoadingExternal || isFetchingExternal;

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

      <JobList jobs={filteredJobs} isLoading={isLoading} />
    </div>
  );
};