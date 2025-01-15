import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TechJobForm } from "./TechJobForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Globe, MapPin, Clock } from "lucide-react";
import { TechJob } from "@/types/job";

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
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
          </SelectContent>
        </Select>
        
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

      {isLoading ? (
        <div>Loading...</div>
      ) : allJobs.length === 0 ? (
        <div>No jobs found</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {allJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <div className="text-muted-foreground">{job.company_name}</div>
                  </div>
                  <Badge variant={job.job_type === "remote" ? "secondary" : "outline"}>
                    {job.job_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.job_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{job.location_type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => window.open(job.application_url, '_blank')}
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};