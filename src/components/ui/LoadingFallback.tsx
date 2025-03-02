import { Spinner } from "./spinner";

export const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
);
