export type PostViolation = {
  id: string;
  post_id: string;
  post: {
    id: string;
    title: string;
    content: string;
    profiles: {
      username: string;
    };
  };
  violation_type: string;
  description: string;
  status: string;
  detected_at: string;
  reviewed_at: string | null;
  action_taken: string | null;
};