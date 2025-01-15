import { PostFormHeader } from "./form/PostFormHeader";
import { PostFormContent } from "./form/PostFormContent";
import { usePostForm } from "./form/usePostForm";
import { useCategorySelect } from "./form/useCategorySelect";

interface BaseCreatePostProps {
  categoryName: string;
  redirectPath: string;
  showSubcategories?: boolean;
  showLiveDiscussion?: boolean;
  showHeadline?: boolean;
}

export const BaseCreatePost = ({
  categoryName,
  redirectPath,
  showSubcategories = true,
  showLiveDiscussion = true,
  showHeadline = false,
}: BaseCreatePostProps) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    subcategoryId,
    setSubcategoryId,
    isLive,
    setIsLive,
    isLoading,
    selectedFiles,
    setSelectedFiles,
    handleSubmit,
  } = usePostForm({
    categoryName,
    redirectPath,
    showLiveDiscussion,
  });

  const { categoryId, subcategories } = useCategorySelect(categoryName, showSubcategories);

  return (
    <div className="container max-w-2xl py-8">
      <PostFormHeader categoryName={categoryName} />
      
      <PostFormContent
        subcategories={subcategories}
        subcategoryId={subcategoryId}
        onSubcategoryChange={setSubcategoryId}
        categoryName={categoryName}
        showSubcategories={showSubcategories}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        showHeadline={showHeadline}
        onImagesChange={setSelectedFiles}
        isLive={isLive}
        onLiveChange={setIsLive}
        showLiveDiscussion={showLiveDiscussion}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};