import { BaseCreatePost } from "./BaseCreatePost";

export const EntertainmentCreatePost = () => {
  return (
    <BaseCreatePost
      categoryName="Entertainment"
      redirectPath="/categories/entertainment"
      showSubcategories={true}
      showLiveDiscussion={true}
    />
  );
};