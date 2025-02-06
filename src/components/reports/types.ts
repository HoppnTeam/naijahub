export interface IssueReport {
  id: string;
  user_id: string;
  category: "content" | "transaction" | "app_improvement" | "user_related" | "general";
  subject: string;
  description: string;
  image_url?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  resolved_by?: string;
  resolution_notes?: string;
  resolved_at?: string;
  profiles: {
    username: string;
  };
}