export type IssueCategory = "content" | "transaction" | "app_improvement" | "user_related" | "general";

export interface IssueReport {
  id: string;
  user_id: string;
  category: IssueCategory;
  subject: string;
  description: string;
  image_url?: string | null;
  status: string;
  created_at: string;
  resolved_by?: string | null;
  resolution_notes?: string | null;
  resolved_at?: string | null;
  user: {
    username: string;
  };
}