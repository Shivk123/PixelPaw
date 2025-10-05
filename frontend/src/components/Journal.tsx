import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Save } from "lucide-react";
import { JournalEntry, Mood } from "@/types/pet";
import { saveJournalEntry, getJournalEntries } from "@/utils/api";
import { toast } from "sonner";

interface JournalProps {
  onMoodUpdate: (mood: Mood) => void;
}

export const Journal = ({ onMoodUpdate }: JournalProps) => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const loaded = await getJournalEntries();
    setEntries(loaded);
  };

  const handleSave = async () => {
    if (!entry.trim()) {
      toast.error("Please write something first");
      return;
    }

    setIsLoading(true);
    try {
      const mood: Mood = 'neutral'; // Could detect mood from entry text
      const saved = await saveJournalEntry(entry, mood);
      
      setEntries(prev => [saved, ...prev]);
      localStorage.setItem('journal_entries', JSON.stringify([saved, ...entries]));
      
      setEntry("");
      toast.success("Journal entry saved! 📝");
      onMoodUpdate(mood);
    } catch (error) {
      toast.error("Failed to save entry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 h-full flex flex-col shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-lg">Daily Journal</h3>
      </div>

      <Textarea
        placeholder="How are you feeling today? Write your thoughts here..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="mb-3 min-h-[120px] resize-none"
      />

      <Button
        variant="care"
        onClick={handleSave}
        disabled={isLoading}
        className="mb-4 w-full"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Entry
      </Button>

      <div className="flex-1 min-h-0">
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Recent Entries</h4>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {entries.slice(0, 3).map((e, index) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-secondary/20 rounded-lg border border-border"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleDateString()}
                  </span>
                  <span className="text-xs">{e.mood === 'happy' ? '😊' : e.mood === 'sad' ? '😢' : '😐'}</span>
                </div>
                <p className="text-sm line-clamp-2">{e.content}</p>
              </motion.div>
            ))}
            {entries.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No entries yet. Start writing!
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
