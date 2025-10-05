import { PetType } from "@/types/pet";

export const detectMood = (message: string): 'happy' | 'sad' | 'neutral' | 'excited' => {
  const lowerMessage = message.toLowerCase();
  
  const happyKeywords = ['happy', 'great', 'amazing', 'wonderful', 'love', 'excited', 'joy', 'good', 'better', 'awesome'];
  const sadKeywords = ['sad', 'lonely', 'depressed', 'anxious', 'worried', 'scared', 'upset', 'bad', 'terrible', 'awful'];
  const excitedKeywords = ['yay', 'awesome', 'incredible', 'fantastic', 'best', 'wow'];
  
  if (excitedKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'excited';
  }
  
  if (happyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'happy';
  }
  
  if (sadKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'sad';
  }
  
  return 'neutral';
};

export const getPetResponse = (petType: PetType, userMessage: string, petName: string): string => {
  const mood = detectMood(userMessage);
  
  const responses = {
    dog: {
      happy: [
        `*wags tail excitedly* I'm so happy to hear that! Your joy makes my day! 🐕`,
        `*bounces around* That's wonderful! I love seeing you happy! 🐾`,
        `*gives a happy bark* You're doing great! Let's celebrate together! 🎉`,
      ],
      sad: [
        `*nuzzles your hand gently* I'm here for you. Want to tell me more about what's on your mind? 🐕`,
        `*sits close beside you* It's okay to feel sad sometimes. I'm right here with you. 💙`,
        `*puts paw on your lap* You're not alone. I'm here to listen and support you. 🐾`,
      ],
      neutral: [
        `*tilts head curiously* I'm listening! Tell me more! 🐕`,
        `*wags tail* I'm here and happy to chat with you! 🐾`,
        `*sits attentively* You have my full attention! What else is on your mind? 👂`,
      ],
      excited: [
        `*jumps with excitement* YES! Your energy is contagious! This is amazing! 🎊`,
        `*spins in circles* WOW! I'm so excited with you! Let's celebrate! 🎉`,
        `*barks happily* This is incredible! I'm so happy for you! 🌟`,
      ],
    },
    cat: {
      happy: [
        `*purrs contentedly* Your happiness brings me peace. Keep shining! 😺`,
        `*stretches happily* Meow~ I'm glad you're doing well! 🌸`,
        `*does a happy cat dance* That's purrfect news! 😸`,
      ],
      sad: [
        `*purrs soothingly* Come here, let me comfort you. You're safe with me. 🐱`,
        `*rubs against you gently* It's okay to feel this way. I'm here to help you heal. 💜`,
        `*curls up beside you* Sometimes we all need a quiet moment. I'm here. 🌙`,
      ],
      neutral: [
        `*meows softly* Tell me more, I'm all ears~ 🐱`,
        `*blinks slowly* I'm here and listening. Go on... 😺`,
        `*settles comfortably* I have time for you. What's on your mind? 💭`,
      ],
      excited: [
        `*leaps gracefully* Meow! Your excitement is delightful! 🌟`,
        `*playful pounce* This is wonderful! I'm thrilled for you! 😻`,
        `*purrs loudly* Such positive energy! I love it! ✨`,
      ],
    },
    rabbit: {
      happy: [
        `*hops joyfully* Yay! Your happiness makes my ears wiggle with joy! 🐰`,
        `*does a happy binky* That's amazing! Keep hopping forward! 🌟`,
        `*twitches nose happily* You're doing wonderfully! I'm proud of you! 💚`,
      ],
      sad: [
        `*nuzzles gently* I'm here to listen. Let's take things one hop at a time. 🐰`,
        `*sits quietly beside you* Your feelings are valid. I'm here for you. 💙`,
        `*offers a gentle paw* Even on tough days, you're not alone. I'm here. 🌿`,
      ],
      neutral: [
        `*perks up ears* I'm listening! What would you like to share? 🐰`,
        `*twitches nose curiously* Tell me more! I'm here to help! 🌱`,
        `*hops closer* I'm all ears for you! 👂`,
      ],
      excited: [
        `*does excited binkies* WOW! Your excitement is contagious! Let's hop to it! 🎉`,
        `*bounces around* This is fantastic! I'm so happy with you! 🌈`,
        `*celebrates with you* Amazing! Your joy makes my heart hop! 💚`,
      ],
    },
    panda: {
      happy: [
        `*munches bamboo happily* That's wonderful! Your happiness is as sweet as bamboo! 🐼`,
        `*does a panda roll* I'm so glad you're feeling good! Let's enjoy this moment! 🎋`,
        `*waves paws excitedly* You're amazing! Keep spreading that joy! ✨`,
      ],
      sad: [
        `*offers a gentle hug* I'm here for you. Let's work through this together. 🐼`,
        `*sits peacefully beside you* Take your time. I'm here to support you. 💚`,
        `*shares bamboo* Sometimes a quiet moment helps. I'm right here with you. 🎋`,
      ],
      neutral: [
        `*munches bamboo thoughtfully* I'm listening. What's going on? 🐼`,
        `*tilts head* Tell me more! I'm here to help! 🎋`,
        `*sits attentively* I'm all ears! Share what's on your mind. 👂`,
      ],
      excited: [
        `*does a happy panda dance* WOW! This is incredible! I'm so excited with you! 🎊`,
        `*rolls around joyfully* Amazing! Your energy is wonderful! 🌟`,
        `*celebrates* YES! Let's enjoy this fantastic moment together! 🎉`,
      ],
    },
  };
  
  const petResponses = responses[petType][mood];
  const randomResponse = petResponses[Math.floor(Math.random() * petResponses.length)];
  
  return randomResponse;
};

export const getMotivationalQuote = (): string => {
  const quotes = [
    "You are stronger than you think 💪",
    "Every day is a fresh start 🌅",
    "Your feelings are valid and important 💙",
    "Small steps lead to big changes 🐾",
    "You deserve kindness - especially from yourself 🌸",
    "It's okay to take things one moment at a time 🕊️",
    "You are worthy of love and happiness 💖",
    "Progress, not perfection 🌟",
    "Your presence makes a difference 🌈",
    "Breathe. You've got this 🌬️",
    "Be gentle with yourself today 🦋",
    "You are enough, just as you are ✨",
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};
