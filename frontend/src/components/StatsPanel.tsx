import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { Stats } from "@/types/pet";

interface StatsPanelProps {
  stats: Stats;
}

const StatBar = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{value}%</span>
    </div>
    <Progress value={value} className="h-2" />
  </div>
);

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const statItems = [
    { label: 'Happiness', value: stats.happiness, icon: '😊' },
    { label: 'Curiosity', value: stats.curiosity, icon: '🔍' },
    { label: 'Obedience', value: stats.obedience, icon: '🎯' },
    { label: 'Energy', value: stats.energy, icon: '⚡' },
    { label: 'Angry', value: stats.angry, icon: '😠' },
    { label: 'Sad', value: stats.sad, icon: '😢' },
  ];

  return (
    <Card className="p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-lg">Personality Stats</h3>
      </div>

      <div className="space-y-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatBar {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
        <p className="text-xs text-center text-muted-foreground">
          Stats grow through positive interactions, journal entries, and care activities! 💫
        </p>
      </div>
    </Card>
  );
};
