import { TechJob } from "@/types/job";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: TechJob[];
  isLoading: boolean;
}

export const JobList = ({ jobs, isLoading }: JobListProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (jobs.length === 0) {
    return <div>No jobs found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};