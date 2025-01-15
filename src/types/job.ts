export interface TechJob {
  id: string;
  user_id: string;
  title: string;
  company_name: string;
  description: string;
  requirements: string;
  job_type: string;
  location_type: string;
  location: string;
  salary_range?: string;
  skills: string[];
  application_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}