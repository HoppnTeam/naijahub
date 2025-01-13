import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
  };
}

interface CommentsListProps {
  comments?: Comment[];
}

export const CommentsList = ({ comments }: CommentsListProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={comment.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {comment.profiles?.username?.substring(0, 2).toUpperCase() ??
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{comment.profiles?.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};