import { Button } from "@/components/ui/button";
import { Utensils, Play, Moon } from "lucide-react";

interface CareActionsProps {
  onCareAction: (action: 'feed' | 'play' | 'sleep') => void;
}

export const CareActions = ({ onCareAction }: CareActionsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        variant="care"
        size="lg"
        onClick={() => onCareAction('feed')}
        className="flex flex-col gap-2 h-auto py-4"
      >
        <Utensils className="w-6 h-6" />
        <span>Feed</span>
      </Button>
      <Button
        variant="accent"
        size="lg"
        onClick={() => onCareAction('play')}
        className="flex flex-col gap-2 h-auto py-4"
      >
        <Play className="w-6 h-6" />
        <span>Play</span>
      </Button>
      <Button
        variant="calm"
        size="lg"
        onClick={() => onCareAction('sleep')}
        className="flex flex-col gap-2 h-auto py-4"
      >
        <Moon className="w-6 h-6" />
        <span>Rest</span>
      </Button>
    </div>
  );
};
