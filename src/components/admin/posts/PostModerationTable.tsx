import { formatDistanceToNow } from "date-fns";
import { Eye, Trash, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  created_at: string;
  profiles: {
    username: string;
  };
  moderation_reports: { id: string }[];
}

interface PostModerationTableProps {
  posts: Post[];
  isLoading: boolean;
}

export const PostModerationTable = ({ posts, isLoading }: PostModerationTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Post Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Report Count</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.profiles.username}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell>{post.moderation_reports?.length || 0}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
                {post.moderation_reports?.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};