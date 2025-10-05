import { useState, useEffect } from "react";
import { Pet, Message, Stats, Mood } from "@/types/pet";
import { MainPet } from "@/components/MainPet";
import { ChatInterface } from "@/components/ChatInterface";
import { MoodBar } from "@/components/MoodBar";
import { CareActions } from "@/components/CareActions";
import { Journal } from "@/components/Journal";
import { MeditationPanel } from "@/components/MeditationPanel";
import { RewardsPanel } from "@/components/RewardsPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { MeditationHistory } from "@/components/MeditationHistory";
import { InteractiveAvatar } from "@/components/InteractiveAvatar";
import { SettingsDialog } from "@/components/SettingsDialog";
import { Card } from "@/components/ui/card";
import { getMotivationalQuote } from "@/utils/petResponses";
import { saveMessages, savePet, loadDailyQuote, saveDailyQuote } from "@/utils/localStorage";
import { sendChatMessage, getStats, updateStats } from "@/utils/api";
import { useMood } from "@/hooks/useMood";
import { toast } from "sonner";
import petDog from "@/assets/pet-dog.png";
import petCat from "@/assets/pet-cat.png";
import petRabbit from "@/assets/pet-rabbit.png";
import petPanda from "@/assets/pet-panda.png";

interface PetCompanionProps {
  pet: Pet;
  onPetUpdate: (pet: Pet) => void;
}

const petImages = {
  dog: petDog,
  cat: petCat,
  rabbit: petRabbit,
  panda: petPanda,
};

export const PetCompanion = ({ pet, onPetUpdate }: PetCompanionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<string>("");
  const [stats, setStats] = useState<Stats>({
    happiness: pet.happiness || 70,
    curiosity: pet.curiosity || 65,
    obedience: pet.obedience || 55,
    energy: pet.energy || 80,
    angry: 0,
    sad: 0,
    level: pet.level || 1,
    xp: pet.xp || 0,
    xpToNextLevel: 100,
  });
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [lastPetMessage, setLastPetMessage] = useState<string>("");
  const { currentMood, updateMood, getMoodEmoji } = useMood('neutral');

  useEffect(() => {
    // Load or generate daily quote
    const savedQuote = loadDailyQuote();
    if (savedQuote) {
      setDailyQuote(savedQuote);
    } else {
      const newQuote = getMotivationalQuote();
      setDailyQuote(newQuote);
      saveDailyQuote(newQuote);
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'pet',
      content: `*waves excitedly* Welcome back! I'm ${pet.name}, and I've missed you! 💖 How are you feeling today?`,
      timestamp: new Date(),
      mood: 'happy',
    };
    setMessages([welcomeMessage]);

    // Load stats
    loadStats();
  }, [pet.name]);

  const loadStats = async () => {
    const loadedStats = await getStats(pet.name);
    setStats(loadedStats);
  };

  const handleSendMessage = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      // Call API with actions and stats support
      const { reply, mood, actions, stats: updatedStats } = await sendChatMessage(userMessage, pet.type, pet.name, messages);

      const petMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'pet',
        content: reply,
        timestamp: new Date(),
        mood: mood,
      };

      const newMessages = [...messages, userMsg, petMsg];
      setMessages(newMessages);
      saveMessages(newMessages);
      setLastPetMessage(reply);

      // Update mood and stats
      updateMood(mood);
      
      // If backend returned updated stats, use them
      if (updatedStats) {
        setStats(updatedStats);
        // Update pet happiness for compatibility
        const updatedPet = {
          ...pet,
          happiness: updatedStats.happiness,
          lastInteraction: new Date(),
        };
        onPetUpdate(updatedPet);
        savePet(updatedPet);
      } else {
        // Fallback to old behavior
        const happinessIncrease = mood === 'happy' || mood === 'excited' ? 5 : 2;
        await updateHappiness(happinessIncrease);
      }
      
      // Show actions if any
      if (actions && actions.length > 0) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      
      await addXP(5);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleCareAction = async (action: 'feed' | 'play' | 'sleep') => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    const actionMessages = {
      feed: `*munch munch* 😋 Thank you for the delicious treat! I feel so loved and energized!`,
      play: `*plays joyfully* 🎾 This is so much fun! You always know how to make me happy!`,
      sleep: `*yawns and stretches* 😴 A nice rest feels wonderful. Thank you for taking care of me!`,
    };

    const careMsg: Message = {
      id: Date.now().toString(),
      role: 'pet',
      content: actionMessages[action],
      timestamp: new Date(),
      mood: 'happy',
    };

    const newMessages = [...messages, careMsg];
    setMessages(newMessages);
    saveMessages(newMessages);

    await updateHappiness(10);
    toast.success(`${pet.name} loved that! +10 happiness ✨`);
  };

  const updateHappiness = async (increase: number) => {
    const newHappiness = Math.min(100, pet.happiness + increase);
    const updatedPet = {
      ...pet,
      happiness: newHappiness,
      lastInteraction: new Date(),
    };
    const newStats = { ...stats, happiness: newHappiness };
    setStats(newStats);
    onPetUpdate(updatedPet);
    savePet(updatedPet);
    await updateStats(pet.name, newStats);
  };

  const addXP = async (amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / prev.xpToNextLevel) + prev.level;
      
      if (newLevel > prev.level) {
        toast.success(`Level up! 🎉 Now level ${newLevel}`);
      }
      
      const newStats = {
        ...prev,
        xp: newXP % prev.xpToNextLevel,
        level: newLevel,
      };
      
      updateStats(pet.name, newStats);
      return newStats;
    });
  };

  const handleMoodUpdate = async (mood: Mood) => {
    updateMood(mood);
    await addXP(3);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Header with quote, mood, and settings */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-[var(--shadow-soft)]">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <p className="text-base md:text-lg font-medium italic flex-1">"{dailyQuote}"</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current mood:</span>
                <span className="text-2xl">{getMoodEmoji(currentMood)}</span>
              </div>
              <SettingsDialog />
            </div>
          </div>
        </Card>

        {/* Responsive Balanced Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Left Column - Pet, Interactive Avatar, Care */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4">
            <MainPet 
              pet={pet} 
              petImage={petImages[pet.type]} 
              isAnimating={isAnimating}
              onAvatarSpeech={handleSendMessage}
            />
            <InteractiveAvatar 
              petName={pet.name}
              petType={pet.type}
              message={lastPetMessage}
            />
            <Card className="p-4 space-y-4 shadow-[var(--shadow-soft)]">
              <MoodBar happiness={stats.happiness} />
              <CareActions onCareAction={handleCareAction} />
            </Card>
          </div>

          {/* Middle Column - Chat and Meditation */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              petImage={petImages[pet.type]}
            />
            <div className="lg:block hidden">
              <MeditationPanel />
            </div>
          </div>

          {/* Right Column - Journal, Stats, Rewards, History */}
          <div className="md:col-span-2 lg:col-span-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <Journal onMoodUpdate={handleMoodUpdate} />
              <StatsPanel stats={stats} />
              <RewardsPanel level={stats.level} xp={stats.xp} xpToNextLevel={stats.xpToNextLevel} />
              <MeditationHistory />
            </div>
            <div className="lg:hidden">
              <MeditationPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
