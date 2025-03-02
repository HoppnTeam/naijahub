-- Function to increment feedback count for beta testers
CREATE OR REPLACE FUNCTION increment_beta_tester_feedback_count(tester_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE beta_testers
  SET feedback_count = feedback_count + 1
  WHERE id = tester_id;
END;
$$;
