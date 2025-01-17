import { CommentsList } from "@/components/CommentsList";

interface ListingCommentsProps {
  comments?: any[];
  listingId: string;
  onCommentAdded: () => void;
}

export const ListingComments = ({ comments, listingId, onCommentAdded }: ListingCommentsProps) => {
  return (
    <CommentsList 
      comments={comments} 
      listingId={listingId} 
      onCommentAdded={onCommentAdded}
    />
  );
};