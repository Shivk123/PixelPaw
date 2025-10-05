import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface HeyGenAvatarProps {
  petName: string;
  petType: string;
  onSpeech?: (text: string) => void;
}

export const HeyGenAvatar = ({ petName, petType, onSpeech }: HeyGenAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize HeyGen Interactive Avatar
    initializeAvatar();
  }, []);

  const initializeAvatar = async () => {
    try {
      // HeyGen Interactive Avatar SDK initialization
      const response = await fetch('/api/heygen/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_id: 'your-avatar-id', // Replace with actual avatar ID
          voice_id: 'your-voice-id',   // Replace with actual voice ID
        }),
      });

      const { session_id, sdp } = await response.json();
      
      // Set up WebRTC connection
      setupWebRTC(sdp, session_id);
      
    } catch (error) {
      console.error('Failed to initialize HeyGen avatar:', error);
      setIsLoading(false);
    }
  };

  const setupWebRTC = async (sdp: string, sessionId: string) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          setIsLoading(false);
        }
      };

      await pc.setRemoteDescription({ type: 'offer', sdp });
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer back to HeyGen
      await fetch('/api/heygen/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          sdp: answer.sdp,
        }),
      });

    } catch (error) {
      console.error('WebRTC setup failed:', error);
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      await fetch('/api/heygen/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          session_id: 'current-session-id', // Store this from initialization
        }),
      });
    } catch (error) {
      console.error('Failed to make avatar speak:', error);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    // Implement speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (event.results[event.results.length - 1].isFinal) {
          onSpeech?.(transcript);
          speakText(`Hello! You said: ${transcript}`);
        }
      };
      
      recognition.start();
    }
  };

  const stopListening = () => {
    // Stop speech recognition
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {petName}
          </h2>
          <p className="text-sm text-muted-foreground capitalize mt-1">
            Your interactive {petType} companion
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isListening ? "default" : "outline"}
            size="sm"
            onClick={toggleListening}
            className="flex items-center gap-2"
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            {isListening ? "Listening..." : "Talk"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="flex items-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};