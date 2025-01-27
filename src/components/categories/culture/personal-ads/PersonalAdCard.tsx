import { Post } from "@/types/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PersonalAdCardProps {
  post: Post;
}

export const PersonalAdCard = ({ post }: PersonalAdCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={post.image_url || post.profiles?.avatar_url} />
          <AvatarFallback>{post.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {post.profiles?.username}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Seeking:</span> {post.seeking_gender}
          </div>
          <div>
            <span className="font-medium">Age Range:</span> {post.age_range}
          </div>
          <div>
            <span className="font-medium">Location:</span> {post.location_preference}
          </div>
          <div>
            <span className="font-medium">Looking for:</span> {post.relationship_type}
          </div>
        </div>
        <p className="text-sm">{post.content}</p>
        {post.interests && post.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.interests.map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};