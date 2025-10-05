import { Pet, Message } from "@/types/pet";

const STORAGE_KEYS = {
  PET: 'pixelpaw_pet',
  MESSAGES: 'pixelpaw_messages',
  QUOTE: 'pixelpaw_quote',
};

export const savePet = (pet: Pet): void => {
  localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(pet));
};

export const loadPet = (): Pet | null => {
  const petData = localStorage.getItem(STORAGE_KEYS.PET);
  if (!petData) return null;
  
  const pet = JSON.parse(petData);
  pet.lastInteraction = new Date(pet.lastInteraction);
  
  // Initialize new fields for backwards compatibility
  if (!pet.level) pet.level = 1;
  if (!pet.xp) pet.xp = 0;
  if (!pet.curiosity) pet.curiosity = 65;
  if (!pet.obedience) pet.obedience = 55;
  if (!pet.energy) pet.energy = 80;
  if (!pet.accessories) pet.accessories = [];
  if (!pet.backgroundColor) pet.backgroundColor = '#F6F5F3';
  
  return pet;
};

export const saveMessages = (messages: Message[]): void => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

export const loadMessages = (): Message[] => {
  const messagesData = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (!messagesData) return [];
  
  const messages = JSON.parse(messagesData);
  return messages.map((msg: Message) => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
  }));
};

export const saveDailyQuote = (quote: string): void => {
  const today = new Date().toDateString();
  localStorage.setItem(STORAGE_KEYS.QUOTE, JSON.stringify({ quote, date: today }));
};

export const loadDailyQuote = (): string | null => {
  const quoteData = localStorage.getItem(STORAGE_KEYS.QUOTE);
  if (!quoteData) return null;
  
  const { quote, date } = JSON.parse(quoteData);
  const today = new Date().toDateString();
  
  // Return null if quote is from a different day
  if (date !== today) return null;
  
  return quote;
};
