"use client"

import React, { useState } from 'react'
import Chat from './components/Chat'
import ChatConversation from './components/ChatConversation'
import Link from 'next/link'

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
      <div className="flex flex-col items-center">        
        <div className="flex items-center mb-3">
          <h1 
            className={`text-5xl md:text-5xl text-4xl whitespace-nowrap font-bold text-gray-800 cursor-pointer px-8 py-2 rounded-full ${
              isHovering ? "bg-white/30 backdrop-blur-sm border border-gray-200 shadow-sm" : ""
            }`}
            onClick={handleConversationClose}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            GrandPrix GPT
          </h1>
        </div>
      </div>
      
      {initialMessage === null ? (
        <Chat onSubmit={handleChatSubmit} />
      ) : (
        <ChatConversation 
          key={conversationKey}
          initialMessage={initialMessage}
          onClose={handleConversationClose} 
        />
      )}
      
      {/* Only show predictions button when not in chat conversation mode */}
      {initialMessage === null && (
        <div className="mt-10">
          <Link 
            href="/predictions" 
            className="px-6 py-3 bg-transparent backdrop-blur-sm border border-gray-300 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 text-gray-600 text-lg font-bold"
          >
            Predictions
          </Link>
        </div>
      )}
    </main>
  )
} 