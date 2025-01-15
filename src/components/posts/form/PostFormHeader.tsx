interface PostFormHeaderProps {
  categoryName: string;
}

export const PostFormHeader = ({ categoryName }: PostFormHeaderProps) => {
  return (
    <h1 className="text-3xl font-bold mb-8">Create a New {categoryName} Post</h1>
  );
};