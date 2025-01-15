import { BaseCreatePost } from "./BaseCreatePost";

export const NewsAndPoliticsCreatePost = () => {
  return (
    <BaseCreatePost
      categoryName="News & Politics"
      redirectPath="/news-and-politics"
      showSubcategories={true}
      showLiveDiscussion={true}
      showHeadline={true}
    />
  );
};