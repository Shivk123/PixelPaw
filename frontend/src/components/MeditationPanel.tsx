import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Play, Pause } from "lucide-react";
import { toast } from "sonner";

export const MeditationPanel = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast.success("Meditation complete! 🧘 +10 XP");
      setTimeLeft(60);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive) return;

    const breathInterval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000);

    return () => clearInterval(breathInterval);
  }, [isActive]);

  const toggleMeditation = () => {
    if (!isActive) {
      toast.success("Starting meditation session... 🌙");
    }
    setIsActive(!isActive);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)] bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-lg">Meditation</h3>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={breathPhase}
              className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-accent/40"
              animate={{
                scale: breathPhase === 'inhale' ? 1.3 : 0.8,
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {isActive ? breathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out' : '🧘'}
            </span>
          </div>
        </div>

        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">Time remaining</p>
            <p className="text-3xl font-bold text-primary">{timeLeft}s</p>
          </motion.div>
        )}

        <Button
          variant={isActive ? "accent" : "care"}
          onClick={toggleMeditation}
          className="w-full"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </>
          )}
        </Button>

        {!isActive && (
          <p className="text-xs text-center text-muted-foreground">
            Take a moment to breathe and center yourself. Your pet will guide you. 💙
          </p>
        )}
      </div>
    </Card>
  );
};
