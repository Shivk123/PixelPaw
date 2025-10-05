import re
from typing import Dict, List, Tuple, Optional

def extract_actions_from_response(response: str) -> List[str]:
    """Extract character actions from chat response using *action* format"""
    action_pattern = r'\*([^*]+)\*'
    actions = re.findall(action_pattern, response)
    return [action.strip() for action in actions]

def update_stats_from_sentiment(current_stats: Dict, sentiment: str, user_message: str) -> Dict:
    """Update personality stats based on user sentiment and message content"""
    stats = current_stats.copy()
    
    # Base stat changes based on sentiment
    if sentiment == "happy":
        stats["happiness"] = min(100, stats.get("happiness", 70) + 3)
        stats["curiosity"] = min(100, stats.get("curiosity", 65) + 2)
        stats["energy"] = min(100, stats.get("energy", 80) + 2)
        stats["sad"] = max(0, stats.get("sad", 0) - 2)
        stats["angry"] = max(0, stats.get("angry", 0) - 1)
    elif sentiment == "sad":
        stats["happiness"] = max(0, stats.get("happiness", 70) - 2)
        stats["energy"] = max(0, stats.get("energy", 80) - 1)
        stats["sad"] = min(100, stats.get("sad", 0) + 3)
    
    # Content-based adjustments
    message_lower = user_message.lower()
    
    # Anger triggers
    if any(word in message_lower for word in ['angry', 'mad', 'furious', 'hate', 'stupid', 'bad']):
        stats["angry"] = min(100, stats.get("angry", 0) + 4)
        stats["happiness"] = max(0, stats.get("happiness", 70) - 3)
    
    # Sadness triggers
    if any(word in message_lower for word in ['sad', 'cry', 'depressed', 'lonely', 'hurt']):
        stats["sad"] = min(100, stats.get("sad", 0) + 3)
        stats["happiness"] = max(0, stats.get("happiness", 70) - 2)
    
    # Positive interactions reduce negative emotions
    if any(word in message_lower for word in ['love', 'good', 'great', 'awesome', 'wonderful']):
        stats["angry"] = max(0, stats.get("angry", 0) - 2)
        stats["sad"] = max(0, stats.get("sad", 0) - 2)
    
    # Curiosity triggers
    if any(word in message_lower for word in ['why', 'how', 'what', 'tell me', 'explain']):
        stats["curiosity"] = min(100, stats.get("curiosity", 65) + 3)
    
    # Obedience triggers (commands, requests)
    if any(word in message_lower for word in ['please', 'can you', 'would you', 'sit', 'stay']):
        stats["obedience"] = min(100, stats.get("obedience", 55) + 2)
    
    # Energy changes
    if any(word in message_lower for word in ['play', 'run', 'jump', 'dance', 'excited']):
        stats["energy"] = min(100, stats.get("energy", 80) + 4)
    elif any(word in message_lower for word in ['tired', 'sleep', 'rest', 'calm']):
        stats["energy"] = max(0, stats.get("energy", 80) - 3)
    
    return stats

def get_action_response(pet_name: str, pet_type: str, actions: List[str]) -> str:
    """Generate response text for performed actions"""
    if not actions:
        return ""
    
    action_responses = {
        'dog': {
            'wag': f"*{pet_name} wags tail happily*",
            'bark': f"*{pet_name} barks excitedly*",
            'jump': f"*{pet_name} jumps up and down*",
            'spin': f"*{pet_name} spins in circles*",
            'pant': f"*{pet_name} pants with joy*",
            'tilt': f"*{pet_name} tilts head curiously*"
        },
        'cat': {
            'purr': f"*{pet_name} purrs contentedly*",
            'stretch': f"*{pet_name} stretches gracefully*",
            'rub': f"*{pet_name} rubs against you*",
            'flick': f"*{pet_name} flicks tail*",
            'yawn': f"*{pet_name} yawns elegantly*"
        },
        'rabbit': {
            'hop': f"*{pet_name} hops excitedly*",
            'twitch': f"*{pet_name} twitches nose*",
            'bounce': f"*{pet_name} bounces around*",
            'nibble': f"*{pet_name} nibbles thoughtfully*"
        },
        'panda': {
            'roll': f"*{pet_name} rolls playfully*",
            'munch': f"*{pet_name} munches bamboo*",
            'hug': f"*{pet_name} gives a gentle hug*",
            'sit': f"*{pet_name} sits peacefully*"
        }
    }
    
    # Return first matching action or generic response
    pet_actions = action_responses.get(pet_type, action_responses['dog'])
    for action in actions:
        action_key = action.lower().split()[0]  # Get first word
        if action_key in pet_actions:
            return pet_actions[action_key]
    
    return f"*{pet_name} {actions[0]}*"