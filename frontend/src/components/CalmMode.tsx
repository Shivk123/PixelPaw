import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";

interface CalmModeProps {
  isActive: boolean;
  onToggle: () => void;
}

export const CalmMode = ({ isActive, onToggle }: CalmModeProps) => {
  const [showBreathing, setShowBreathing] = useState(false);

  return (
    <div className="space-y-4">
      <Button
        variant={isActive ? "calm" : "outline"}
        size="lg"
        onClick={onToggle}
        className="w-full"
      >
        {isActive ? (
          <>
            <Sun className="w-5 h-5 mr-2" />
            Exit Calm Mode
          </>
        ) : (
          <>
            <Moon className="w-5 h-5 mr-2" />
            Enter Calm Mode
          </>
        )}
      </Button>

      {isActive && (
        <Card className="p-6 bg-gradient-to-br from-secondary/30 to-primary/20 animate-fade-in">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">Let's take a moment to breathe together 🌙</p>
            
            {!showBreathing ? (
              <Button
                variant="calm"
                onClick={() => setShowBreathing(true)}
                className="mt-4"
              >
                Start Breathing Exercise
              </Button>
            ) : (
              <div className="py-8 space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-breathing" />
                  <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                    <p className="text-sm font-medium">Breathe</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Inhale... (4 seconds)</p>
                  <p>Hold... (4 seconds)</p>
                  <p>Exhale... (4 seconds)</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowBreathing(false)}
                  className="mt-4"
                >
                  Finish Exercise
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
