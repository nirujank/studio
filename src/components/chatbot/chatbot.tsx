'use client';

import { useState } from 'react';
import { ChatbotButton } from './chatbot-button';
import { ChatWindow } from './chat-window';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <ChatWindow onClose={() => setIsOpen(false)} />
      ) : (
        <ChatbotButton onClick={() => setIsOpen(true)} />
      )}
    </div>
  );
}
