import { Message, JournalEntry, Reward, Stats, Mood } from "@/types/pet";
import { getPetResponse, detectMood } from "./petResponses";

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Chat API
export const sendChatMessage = async (
  message: string,
  petType: string,
  petName: string,
  conversationHistory: Message[]
): Promise<{ reply: string; mood: Mood }> => {
  await delay(800);
  
  const userMood = detectMood(message);
  const reply = getPetResponse(petType as any, message, petName);
  
  return {
    reply,
    mood: userMood,
  };
};

// Mock Journal API
export const saveJournalEntry = async (
  content: string,
  mood: Mood
): Promise<JournalEntry> => {
  await delay(500);
  
  return {
    id: Date.now().toString(),
    date: new Date(),
    content,
    mood,
    tags: [],
  };
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  await delay(300);
  
  const stored = localStorage.getItem('journal_entries');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// Mock Rewards API
export const getRewards = async (): Promise<Reward[]> => {
  await delay(300);
  
  const stored = localStorage.getItem('rewards');
  if (stored) {
    return JSON.parse(stored);
  }
  
  return [
    { id: '1', type: 'badge', name: 'First Chat', description: 'Had your first conversation', icon: '💬', earned: true, earnedAt: new Date() },
    { id: '2', type: 'badge', name: 'Journal Keeper', description: 'Write 5 journal entries', icon: '📔', earned: false },
    { id: '3', type: 'treat', name: 'Golden Treat', description: 'Reach level 5', icon: '🍪', earned: false },
    { id: '4', type: 'badge', name: 'Meditation Master', description: 'Complete 10 meditation sessions', icon: '🧘', earned: false },
    { id: '5', type: 'accessory', name: 'Crown', description: 'Reach level 10', icon: '👑', earned: false },
  ];
};

export const earnReward = async (rewardId: string): Promise<Reward> => {
  await delay(300);
  
  const rewards = await getRewards();
  const reward = rewards.find(r => r.id === rewardId);
  
  if (reward) {
    reward.earned = true;
    reward.earnedAt = new Date();
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }
  
  return reward!;
};

// Mock Stats API
export const getStats = async (pet: any): Promise<Stats> => {
  await delay(200);
  
  return {
    happiness: pet.happiness || 70,
    curiosity: pet.curiosity || 65,
    obedience: pet.obedience || 55,
    energy: pet.energy || 80,
    level: pet.level || 1,
    xp: pet.xp || 0,
    xpToNextLevel: 100,
  };
};

// Mock Avatar Customization API
export const getAvailableAccessories = async (): Promise<string[]> => {
  await delay(200);
  return ['hat', 'glasses', 'scarf', 'crown', 'bow'];
};

export const applyAccessory = async (accessory: string): Promise<boolean> => {
  await delay(300);
  return true;
};
