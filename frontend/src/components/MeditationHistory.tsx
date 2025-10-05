import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Brain, Clock, Calendar } from "lucide-react";

interface MeditationSession {
  date: string;
  duration: number;
  type: string;
}

export const MeditationHistory = () => {
  // Mock data - in real app this would come from localStorage or API
  const sessions: MeditationSession[] = [
    { date: "Today", duration: 10, type: "Breathing" },
    { date: "Yesterday", duration: 15, type: "Mindfulness" },
    { date: "2 days ago", duration: 5, type: "Quick Calm" },
  ];

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);

  return (
    <Card className="p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-lg">Meditation History</h3>
      </div>

      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-primary/10 rounded-lg">
            <div className="text-lg font-bold text-primary">{totalSessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center p-2 bg-accent/10 rounded-lg">
            <div className="text-lg font-bold text-accent">{totalMinutes}m</div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Sessions</h4>
          {sessions.map((session, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">{session.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-medium">{session.duration}m</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 p-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
          <p className="text-xs text-center text-muted-foreground">
            Keep up the great work! 🧘‍♀️
          </p>
        </div>
      </div>
    </Card>
  );
};