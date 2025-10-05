import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";

interface MoodBarProps {
  happiness: number;
}

export const MoodBar = ({ happiness }: MoodBarProps) => {
  const getHappinessLabel = (value: number): string => {
    if (value >= 80) return "Thriving ✨";
    if (value >= 60) return "Happy 😊";
    if (value >= 40) return "Content 🙂";
    if (value >= 20) return "Okay 😐";
    return "Needs love 💙";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-accent fill-accent animate-float" />
          <span className="font-medium">Happiness</span>
        </div>
        <span className="text-sm font-semibold text-primary">
          {getHappinessLabel(happiness)}
        </span>
      </div>
      <Progress 
        value={happiness} 
        className="h-3 bg-muted shadow-inner"
      />
    </div>
  );
};
