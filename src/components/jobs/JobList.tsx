import { TechJob } from "@/types/job";
import { JobCard } from "./JobCard";
import { Loader2 } from "lucide-react";

interface JobListProps {
  jobs: TechJob[];
  isLoading: boolean;
}

export const JobList = ({ jobs, isLoading }: JobListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No jobs found matching your criteria
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};