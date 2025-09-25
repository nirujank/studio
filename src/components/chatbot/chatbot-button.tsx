import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

type ChatbotButtonProps = {
  onClick: () => void;
};

export function ChatbotButton({ onClick }: ChatbotButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="h-14 w-14 rounded-full shadow-lg"
    >
      <MessageSquare className="h-6 w-6" />
      <span className="sr-only">Open Chatbot</span>
    </Button>
  );
}
