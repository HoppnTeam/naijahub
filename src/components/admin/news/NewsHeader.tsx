import { NewsFetchButton } from "./NewsFetchButton";

interface NewsHeaderProps {
  onFetchArticles: () => Promise<void>;
}

export const NewsHeader = ({ onFetchArticles }: NewsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Aggregated News</h2>
      <NewsFetchButton onClick={onFetchArticles} />
    </div>
  );
};