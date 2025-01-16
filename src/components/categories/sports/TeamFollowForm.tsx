import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamFollowFormProps {
  onFollow: () => void;
}

export const TeamFollowForm = ({ onFollow }: TeamFollowFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teamName, setTeamName] = useState("");
  const [league, setLeague] = useState("");
  const [reason, setReason] = useState("");

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to follow teams",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("sports_team_follows").insert([
        {
          user_id: user.id,
          team_name: teamName,
          league,
          reason,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `You are now following ${teamName}`,
      });

      setTeamName("");
      setLeague("");
      setReason("");
      onFollow();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow team. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Enter team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <Input
        placeholder="Enter league (e.g., Premier League, NPFL)"
        value={league}
        onChange={(e) => setLeague(e.target.value)}
      />
      <Textarea
        placeholder="Why do you support this team?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <Button 
        onClick={handleFollow}
        className="w-full"
        disabled={!teamName || !league}
      >
        <Trophy className="mr-2 h-4 w-4" />
        Follow Team
      </Button>
    </div>
  );
};