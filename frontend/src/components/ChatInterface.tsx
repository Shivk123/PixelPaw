import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, MicOff } from "lucide-react";
import { Message } from "@/types/pet";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { toast } from "sonner";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  petImage: string;
}

export const ChatInterface = ({ messages, onSendMessage, petImage }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const toggleListening = () => {
    if (!isSupported) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
      toast.success("Listening... Speak now!");
    }
  };

  return (
    <Card className="flex flex-col h-[500px] shadow-[var(--shadow-soft)]">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {message.role === 'pet' && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 p-1 flex-shrink-0">
                    <img
                      src={petImage}
                      alt="Pet"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-secondary text-secondary-foreground rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Share your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1"
          />
          <Button
            variant={isListening ? "accent" : "outline"}
            size="icon"
            onClick={toggleListening}
            className={isListening ? "animate-glow-pulse" : ""}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            variant="care"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
