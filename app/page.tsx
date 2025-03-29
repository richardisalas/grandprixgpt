"use client"

import React, { useState } from 'react'
import Chat from './components/Chat'
import ChatConversation from './components/ChatConversation'

export default function Home() {
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [conversationKey, setConversationKey] = useState<string>('initial');
  const [isHovering, setIsHovering] = useState(false);

  const handleChatSubmit = (message: string) => {
    setInitialMessage(message);
    // Generate a new key to force a fresh conversation component instance
    setConversationKey(Date.now().toString());
  };
  
  const handleConversationClose = () => {
    setInitialMessage(null);
    setIsHovering(false); // Force reset hover state on click
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <h1 
        className={`text-5xl md:text-5xl text-4xl whitespace-nowrap font-bold text-gray-800 mb-5 cursor-pointer px-8 py-2 rounded-full ${
          isHovering ? "bg-white/30 backdrop-blur-sm border border-gray-200 shadow-sm" : ""
        }`}
        onClick={handleConversationClose}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        GrandPrix GPT
      </h1>
      
      {initialMessage === null ? (
        <Chat onSubmit={handleChatSubmit} />
      ) : (
        <ChatConversation 
          key={conversationKey}
          initialMessage={initialMessage}
          onClose={handleConversationClose} 
        />
      )}
    </main>
  )
} 