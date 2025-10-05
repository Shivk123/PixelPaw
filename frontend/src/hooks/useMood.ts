import { useState, useCallback } from 'react';
import { Mood } from '@/types/pet';

export const useMood = (initialMood: Mood = 'neutral') => {
  const [currentMood, setCurrentMood] = useState<Mood>(initialMood);
  const [moodHistory, setMoodHistory] = useState<{ mood: Mood; timestamp: Date }[]>([]);

  const updateMood = useCallback((newMood: Mood) => {
    setCurrentMood(newMood);
    setMoodHistory(prev => [
      ...prev,
      { mood: newMood, timestamp: new Date() }
    ].slice(-10)); // Keep last 10 mood changes
  }, []);

  const getMoodColor = useCallback((mood: Mood): string => {
    const moodColors: Record<Mood, string> = {
      happy: 'text-green-500',
      excited: 'text-yellow-500',
      calm: 'text-blue-400',
      neutral: 'text-gray-500',
      sad: 'text-blue-600',
      anxious: 'text-orange-500',
    };
    return moodColors[mood];
  }, []);

  const getMoodEmoji = useCallback((mood: Mood): string => {
    const moodEmojis: Record<Mood, string> = {
      happy: '😊',
      excited: '🤗',
      calm: '😌',
      neutral: '😐',
      sad: '😢',
      anxious: '😰',
    };
    return moodEmojis[mood];
  }, []);

  return {
    currentMood,
    moodHistory,
    updateMood,
    getMoodColor,
    getMoodEmoji,
  };
};
