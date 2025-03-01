import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NewPostIndicatorProps {
  count: number;
  onClick: () => void;
}

export const NewPostIndicator = ({ count, onClick }: NewPostIndicatorProps) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            onClick={onClick}
            variant="default"
            size="lg"
            className="shadow-lg flex items-center gap-2 bg-[#32a852] hover:bg-[#2a8f45]"
          >
            <ArrowUp className="w-4 h-4" />
            {count} new post{count !== 1 ? 's' : ''}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
