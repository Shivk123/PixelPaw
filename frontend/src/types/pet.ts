export type PetType = 'dog' | 'cat' | 'rabbit' | 'panda';
export type Mood = 'happy' | 'sad' | 'neutral' | 'excited' | 'calm' | 'anxious';

export interface Pet {
  type: PetType;
  name: string;
  happiness: number;
  lastInteraction: Date;
  // Enhanced stats
  level: number;
  xp: number;
  curiosity: number;
  obedience: number;
  energy: number;
  // Customization
  accessories: string[];
  backgroundColor: string;
}

export interface Message {
  id: string;
  role: 'user' | 'pet';
  content: string;
  timestamp: Date;
  mood?: Mood;
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: Mood;
  tags?: string[];
}

export interface Reward {
  id: string;
  type: 'badge' | 'treat' | 'accessory';
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface Stats {
  happiness: number;
  curiosity: number;
  obedience: number;
  energy: number;
  angry: number;
  sad: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}
