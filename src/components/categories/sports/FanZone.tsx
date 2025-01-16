import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy } from "lucide-react";
import { TeamFollowForm } from "./TeamFollowForm";
import { FanPosts } from "./FanPosts";
import { TeamFollowsList } from "./TeamFollowsList";

export const FanZone = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Fan Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TeamFollowForm onFollow={() => {
              // Trigger a refetch of the follows list
              window.location.reload();
            }} />
            <FanPosts />
            <TeamFollowsList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};