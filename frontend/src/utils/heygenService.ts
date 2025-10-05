interface HeyGenResponse {
  success: boolean;
  data?: {
    video_url?: string;
    audio_url?: string;
    session_id?: string;
  };
  error?: string;
}

interface HeyGenVideoRequest {
  text: string;
  avatar_id?: string;
  voice_id?: string;
  background?: string;
}

class HeyGenService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = localStorage.getItem('heygen_api_key') || import.meta.env.VITE_HEYGEN_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_HEYGEN_API_URL || 'https://api.heygen.com/v2';
  }

  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
    localStorage.setItem('heygen_api_key', newApiKey);
  }

  async generateVideo(request: HeyGenVideoRequest): Promise<HeyGenResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'HeyGen API key not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/video/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          avatar_id: request.avatar_id || 'default_avatar',
          voice_id: request.voice_id || 'default_voice',
          background: request.background || '#F6F5F3',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to generate video' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }

  async getVideoStatus(sessionId: string): Promise<HeyGenResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'HeyGen API key not configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/video/status/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: 'Failed to check video status' };
    }
  }
}

export const heygenService = new HeyGenService();