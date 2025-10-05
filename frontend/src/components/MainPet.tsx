import { Card } from "@/components/ui/card";
import { Pet } from "@/types/pet";
import { HeyGenAvatar } from "@/components/HeyGenAvatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Image } from "lucide-react";

interface MainPetProps {
  pet: Pet;
  petImage: string;
  isAnimating: boolean;
  onAvatarSpeech?: (text: string) => void;
}

export const MainPet = ({ pet, petImage, isAnimating, onAvatarSpeech }: MainPetProps) => {
  const [useInteractiveAvatar, setUseInteractiveAvatar] = useState(false);

  if (useInteractiveAvatar) {
    return (
      <div className="space-y-2">
        <HeyGenAvatar 
          petName={pet.name} 
          petType={pet.type} 
          onSpeech={onAvatarSpeech}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setUseInteractiveAvatar(false)}
          className="w-full flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          Switch to Static
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-4 flex items-center justify-center ${
              isAnimating ? 'animate-gentle-bounce' : 'animate-float'
            }`}
          >
            <img
              src={petImage}
              alt={pet.name}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {pet.name}
            </h2>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              Your {pet.type} companion
            </p>
          </div>
        </div>
      </Card>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setUseInteractiveAvatar(true)}
        className="w-full flex items-center gap-2"
      >
        <Bot className="w-4 h-4" />
        Enable Interactive Avatar
      </Button>
    </div>
  );
};
