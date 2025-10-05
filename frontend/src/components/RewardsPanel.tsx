import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Star } from "lucide-react";
import { Reward } from "@/types/pet";
import { getRewards } from "@/utils/api";

interface RewardsPanelProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export const RewardsPanel = ({ level, xp, xpToNextLevel }: RewardsPanelProps) => {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    const loaded = await getRewards();
    setRewards(loaded);
  };

  const earnedCount = rewards.filter(r => r.earned).length;

  return (
    <Card className="p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-accent animate-float" />
        <h3 className="font-semibold text-lg">Rewards & Progress</h3>
      </div>

      {/* Level & XP */}
      <div className="mb-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="font-bold text-lg">Level {level}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {xp} / {xpToNextLevel} XP
          </span>
        </div>
        <Progress value={(xp / xpToNextLevel) * 100} className="h-2" />
      </div>

      {/* Rewards List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-muted-foreground">Achievements</h4>
          <span className="text-xs text-muted-foreground">
            {earnedCount} / {rewards.length}
          </span>
        </div>
        
        <ScrollArea className="h-[200px] pr-3">
          <div className="space-y-2">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-all ${
                  reward.earned
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-muted/30 border-border opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{reward.name}</h5>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {reward.description}
                    </p>
                    {reward.earned && reward.earnedAt && (
                      <p className="text-xs text-primary mt-1">
                        Earned {new Date(reward.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
