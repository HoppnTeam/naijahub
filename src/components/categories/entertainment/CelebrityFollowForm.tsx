import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CelebrityFollowForm = ({ onFollow }: { onFollow: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newCelebrity, setNewCelebrity] = useState("");
  const [followReason, setFollowReason] = useState("");

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow celebrities",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("celebrity_follows").insert([
        {
          user_id: user.id,
          celebrity_name: newCelebrity,
          reason: followReason,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `You are now following ${newCelebrity}`,
      });

      setNewCelebrity("");
      setFollowReason("");
      onFollow();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow celebrity. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Enter celebrity name"
        value={newCelebrity}
        onChange={(e) => setNewCelebrity(e.target.value)}
      />
      <Textarea
        placeholder="Why do you follow them?"
        value={followReason}
        onChange={(e) => setFollowReason(e.target.value)}
      />
      <Button 
        onClick={handleFollow}
        className="w-full"
        disabled={!newCelebrity}
      >
        <Star className="mr-2 h-4 w-4" />
        Follow Celebrity
      </Button>
    </div>
  );
};