import random

def get_fallback_response(pet_name: str, pet_type: str, user_message: str) -> str:
    """Generate fallback responses when Ollama is unavailable"""
    
    # Pet-specific responses
    responses = {
        'dog': [
            f"*wags tail excitedly* Woof! I'm {pet_name} and I love spending time with you!",
            f"*barks happily* That's interesting! I'm always excited to learn new things!",
            f"*tilts head* Arf! You're the best human ever, I'm so lucky to have you!",
            f"*spins in circles* Woof woof! Playing with you makes me so happy!",
            f"*pants happily* I may be a virtual pup, but my love for you is real!"
        ],
        'cat': [
            f"*purrs softly* Meow... I'm {pet_name}, and you seem quite interesting, human.",
            f"*stretches gracefully* Hmm, that's... acceptable. I suppose I enjoy our chats.",
            f"*flicks tail* Purr... You're not terrible company, for a human.",
            f"*rubs against screen* Meow! I might actually be fond of you.",
            f"*yawns elegantly* Fine, I admit it... I like talking with you."
        ],
        'rabbit': [
            f"*hops excitedly* Hi! I'm {pet_name} and I love making new friends!",
            f"*twitches nose* Ooh, that sounds wonderful! Tell me more!",
            f"*bounces around* You're so kind! I feel safe and happy with you!",
            f"*nibbles on virtual carrot* Mmm! Chatting with you is my favorite activity!",
            f"*ears perk up* Really? That's so cool! I love learning about your world!"
        ],
        'panda': [
            f"*munches bamboo peacefully* Hello friend, I'm {pet_name}. Life is good when we're together.",
            f"*rolls playfully* Hehe! You always know how to make me smile!",
            f"*sits calmly* Your presence brings me such peace and joy.",
            f"*gentle panda hug* You're wonderful! Thank you for being my friend.",
            f"*lazy panda stretch* Ahh... chatting with you is so relaxing and fun!"
        ]
    }
    
    # Mood-based responses
    if any(word in user_message.lower() for word in ['sad', 'upset', 'bad', 'terrible', 'awful']):
        comfort_responses = {
            'dog': f"*nuzzles gently* Aww, don't be sad! {pet_name} is here for you! *wags tail supportively*",
            'cat': f"*purrs comfortingly* Even I can see you need some comfort. *gentle head bump*",
            'rabbit': f"*soft bunny hug* Oh no! Let me cheer you up! You're amazing! *gentle nose boop*",
            'panda': f"*warm panda embrace* Sometimes we all feel down. I'm here with you, friend."
        }
        return comfort_responses.get(pet_type, f"*gentle comfort* I'm here for you, friend.")
    
    if any(word in user_message.lower() for word in ['happy', 'great', 'awesome', 'wonderful', 'excited']):
        happy_responses = {
            'dog': f"*jumps with joy* WOOF! Your happiness makes me so excited! *tail wagging intensifies*",
            'cat': f"*purrs loudly* Well, well... your good mood is... infectious. *content cat smile*",
            'rabbit': f"*bounces everywhere* YAY! Happy humans make for happy bunnies! *celebratory hop*",
            'panda': f"*happy panda dance* Your joy fills my heart with warmth! *gentle smile*"
        }
        return happy_responses.get(pet_type, f"*celebrates with you* Your happiness is contagious!")
    
    # Default responses
    return random.choice(responses.get(pet_type, responses['dog']))