// HeyGen API integration utilities
const HEYGEN_API_KEY = process.env.VITE_HEYGEN_API_KEY || 'your-api-key';
const HEYGEN_BASE_URL = 'https://api.heygen.com/v2';

export interface HeyGenSession {
  session_id: string;
  sdp: string;
}

export const createHeyGenSession = async (avatarId: string, voiceId: string): Promise<HeyGenSession> => {
  try {
    const response = await fetch(`${HEYGEN_BASE_URL}/streaming/create_session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HEYGEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar_id: avatarId,
        voice_id: voiceId,
        quality: 'high',
        avatar_pose_id: 'sitting',
      }),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create HeyGen session:', error);
    throw error;
  }
};

export const startHeyGenSession = async (sessionId: string, sdp: string): Promise<void> => {
  try {
    const response = await fetch(`${HEYGEN_BASE_URL}/streaming/start_session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HEYGEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        sdp: sdp,
      }),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to start HeyGen session:', error);
    throw error;
  }
};

export const speakWithAvatar = async (sessionId: string, text: string): Promise<void> => {
  try {
    const response = await fetch(`${HEYGEN_BASE_URL}/streaming/speak`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HEYGEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        text: text,
        task_type: 'talk',
      }),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to make avatar speak:', error);
    throw error;
  }
};

export const closeHeyGenSession = async (sessionId: string): Promise<void> => {
  try {
    const response = await fetch(`${HEYGEN_BASE_URL}/streaming/close_session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HEYGEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to close HeyGen session:', error);
    throw error;
  }
};