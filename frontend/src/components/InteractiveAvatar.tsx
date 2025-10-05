import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Play, Pause } from 'lucide-react';
import { heygenService } from '@/utils/heygenService';
import { toast } from 'sonner';

interface InteractiveAvatarProps {
  petName: string;
  petType: string;
  message: string;
  onVideoGenerated?: (videoUrl: string) => void;
}

export const InteractiveAvatar = ({ petName, petType, message, onVideoGenerated }: InteractiveAvatarProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const generateVideo = async () => {
    if (!message.trim()) {
      toast.error('No message to generate video for');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await heygenService.generateVideo({
        text: `Hi! I'm ${petName}, your ${petType} companion. ${message}`,
        avatar_id: `pet_${petType}`,
        voice_id: 'friendly_voice',
        background: '#F6F5F3'
      });

      if (response.success && response.data?.video_url) {
        setVideoUrl(response.data.video_url);
        onVideoGenerated?.(response.data.video_url);
        toast.success('Interactive video generated!');
      } else {
        toast.error(response.error || 'Failed to generate video');
      }
    } catch (error) {
      toast.error('Error generating interactive video');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Interactive Avatar</h3>
        <Button
          onClick={generateVideo}
          disabled={isGenerating || !message.trim()}
          size="sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Video'
          )}
        </Button>
      </div>

      {videoUrl && (
        <div className="space-y-2">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full rounded-lg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          <Button
            onClick={togglePlayback}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>
      )}

      {!videoUrl && !isGenerating && (
        <div className="text-center text-muted-foreground text-sm">
          Generate an interactive video to see your pet come to life!
        </div>
      )}
    </Card>
  );
};