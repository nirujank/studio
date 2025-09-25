'use client';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Loader2, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatbotAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { currentUser as adminUser, staffData } from '@/lib/data';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type ChatWindowProps = {
  onClose: () => void;
};

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [currentUser, setCurrentUser] = useState(adminUser);
  const [userRole, setUserRole] = useState<'admin' | 'staff'>('admin');
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (typeof window !== 'undefined') {
        const role = sessionStorage.getItem('userRole') as 'admin' | 'staff' | null;
        const userId = sessionStorage.getItem('userId');
        
        setUserRole(role || 'admin');

        if (role === 'staff' && userId) {
            const staffUser = staffData.find(s => s.id === userId);
            if (staffUser) {
                setCurrentUser(staffUser);
            }
        } else {
            setCurrentUser(adminUser);
        }
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const query = input;
    setInput('');

    startTransition(async () => {
      const history = newMessages.map(m => ({ role: m.role, content: m.content }));
      const result = await chatbotAction(query, currentUser.id, userRole, history);
      
      if (result.error) {
        setMessages(prev => [...prev, { role: 'model', content: result.error! }]);
      } else if (result.data) {
        setMessages(prev => [...prev, { role: 'model', content: result.data.response }]);
      }
    });
  };

  return (
    <Card className="w-80 h-96 flex flex-col shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <CardTitle className="text-lg font-headline">AI Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-3 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 text-sm bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isPending}
          />
          <Button onClick={handleSendMessage} disabled={isPending || input.trim() === ''}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
