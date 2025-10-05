import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PetType } from "@/types/pet";
import petDog from "@/assets/pet-dog.png";
import petCat from "@/assets/pet-cat.png";
import petRabbit from "@/assets/pet-rabbit.png";
import petPanda from "@/assets/pet-panda.png";

interface PetSelectionProps {
  onPetSelected: (petType: PetType, name: string) => void;
}

const pets = [
  { type: 'dog' as PetType, image: petDog, name: 'Buddy', description: 'Loyal & Playful' },
  { type: 'cat' as PetType, image: petCat, name: 'Luna', description: 'Calm & Wise' },
  { type: 'rabbit' as PetType, image: petRabbit, name: 'Clover', description: 'Gentle & Encouraging' },
  { type: 'panda' as PetType, image: petPanda, name: 'Bamboo', description: 'Joyful & Supportive' },
];

export const PetSelection = ({ onPetSelected }: PetSelectionProps) => {
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [petName, setPetName] = useState("");

  const handleContinue = () => {
    if (selectedPet && petName.trim()) {
      onPetSelected(selectedPet, petName.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Welcome to PixelPaw 🐾
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your companion for this healing journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pets.map((pet) => (
            <Card
              key={pet.type}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedPet === pet.type
                  ? 'ring-4 ring-primary shadow-[var(--shadow-glow)] bg-primary/10'
                  : 'hover:shadow-[var(--shadow-soft)]'
              }`}
              onClick={() => setSelectedPet(pet.type)}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-2 ${
                  selectedPet === pet.type ? 'animate-glow-pulse' : ''
                }`}>
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{pet.name}</h3>
                  <p className="text-sm text-muted-foreground">{pet.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedPet && (
          <Card className="p-8 animate-fade-in shadow-[var(--shadow-soft)]">
            <div className="space-y-4">
              <div>
                <label className="text-lg font-medium mb-2 block">
                  What would you like to name your companion? 💝
                </label>
                <Input
                  type="text"
                  placeholder="Enter a name..."
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="text-lg border-2 focus:ring-primary transition-all"
                  maxLength={20}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && petName.trim()) {
                      handleContinue();
                    }
                  }}
                />
              </div>
              <Button
                variant="care"
                size="lg"
                onClick={handleContinue}
                disabled={!petName.trim()}
                className="w-full text-lg"
              >
                Begin Your Journey Together ✨
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
