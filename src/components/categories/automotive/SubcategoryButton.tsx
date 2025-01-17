import { Button } from "@/components/ui/button";

interface SubcategoryButtonProps {
  id: string | null;
  name?: string;
  description?: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export const SubcategoryButton = ({
  id,
  name,
  description,
  icon,
  isSelected,
  onClick,
}: SubcategoryButtonProps) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={onClick}
      className={`flex items-center gap-2 h-auto p-4 w-full justify-start ${
        isSelected ? 'bg-primary hover:bg-primary/90' : ''
      }`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="text-left flex-1 min-w-0">
        <div className="font-semibold truncate">{name}</div>
        {description && (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </div>
        )}
      </div>
    </Button>
  );
};