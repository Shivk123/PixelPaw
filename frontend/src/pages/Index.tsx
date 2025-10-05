import { useState, useEffect } from "react";
import { PetSelection } from "@/components/PetSelection";
import { PetCompanion } from "@/pages/PetCompanion";
import { Pet, PetType } from "@/types/pet";
import { loadPet, savePet } from "@/utils/localStorage";

const Index = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPet = loadPet();
    if (savedPet) {
      setPet(savedPet);
    }
    setIsLoading(false);
  }, []);

  const handlePetSelected = (petType: PetType, name: string) => {
    const newPet: Pet = {
      type: petType,
      name: name,
      happiness: 70,
      lastInteraction: new Date(),
      level: 1,
      xp: 0,
      curiosity: 65,
      obedience: 55,
      energy: 80,
      accessories: [],
      backgroundColor: '#F6F5F3',
    };
    setPet(newPet);
    savePet(newPet);
  };

  const handlePetUpdate = (updatedPet: Pet) => {
    setPet(updatedPet);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-float text-4xl">🐾</div>
      </div>
    );
  }

  if (!pet) {
    return <PetSelection onPetSelected={handlePetSelected} />;
  }

  return <PetCompanion pet={pet} onPetUpdate={handlePetUpdate} />;
};

export default Index;
