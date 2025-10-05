import axios from 'axios';
import { Message, JournalEntry, Reward, Stats, Mood } from '@/types/pet';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Chat API
export const sendChatMessage = async (
  message: string,
  petType: string,
  petName: string,
  conversationHistory: Message[]
): Promise<{ reply: string; mood: Mood; actions?: string[]; stats?: Stats }> => {
  try {
    const response = await api.post('/chat', {
      message,
      petType,
      petName,
    });
    return response.data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw new Error('Failed to send message');
  }
};

// Pet Stats API
export const getStats = async (petName: string): Promise<Stats> => {
  try {
    const response = await api.get(`/pet/${petName}/stats`);
    return response.data;
  } catch (error) {
    console.error('Get stats error:', error);
    return {
      happiness: 70,
      curiosity: 65,
      obedience: 55,
      energy: 80,
      angry: 0,
      sad: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
    };
  }
};

export const updateStats = async (petName: string, stats: Stats): Promise<boolean> => {
  try {
    await api.post(`/pet/${petName}/stats`, stats);
    return true;
  } catch (error) {
    console.error('Update stats error:', error);
    return false;
  }
};

// Journal API
export const saveJournalEntry = async (
  content: string,
  mood: Mood
): Promise<JournalEntry> => {
  try {
    const response = await api.post('/journal', {
      content,
      mood,
      date: new Date(),
      tags: [],
    });
    
    return {
      id: response.data.id,
      date: new Date(),
      content,
      mood,
      tags: [],
    };
  } catch (error) {
    console.error('Save journal error:', error);
    throw new Error('Failed to save journal entry');
  }
};

export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const response = await api.get('/journal');
    return response.data.map((entry: any) => ({
      ...entry,
      date: new Date(entry.timestamp || entry.date),
    }));
  } catch (error) {
    console.error('Get journal entries error:', error);
    return [];
  }
};

// Mock implementations for features not yet implemented in backend
export const getRewards = async (): Promise<Reward[]> => {
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
  const rewards = await getRewards();
  const reward = rewards.find(r => r.id === rewardId);
  
  if (reward) {
    reward.earned = true;
    reward.earnedAt = new Date();
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }
  
  return reward!;
};

export const getAvailableAccessories = async (): Promise<string[]> => {
  return ['hat', 'glasses', 'scarf', 'crown', 'bow'];
};

export const applyAccessory = async (accessory: string): Promise<boolean> => {
  return true;
};