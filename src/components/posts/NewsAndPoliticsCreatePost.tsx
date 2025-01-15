import { BaseCreatePost } from "./BaseCreatePost";

export const NewsAndPoliticsCreatePost = () => {
  return (
    <BaseCreatePost
      categoryName="News & Politics"
      redirectPath="/categories/news-politics"
      showLiveDiscussion={true}
      showSubcategories={true}
    />
  );
};