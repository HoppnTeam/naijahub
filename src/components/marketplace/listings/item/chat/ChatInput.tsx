
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = ({ value, onChange, onSubmit, isLoading }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 p-4 mt-auto">
      <Input
        placeholder="Type a message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
