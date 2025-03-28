"use client"

import React, { useState } from 'react'
import Chat from './components/Chat'
import ChatConversation from './components/ChatConversation'

export default function Home() {
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  const handleChatSubmit = (message: string) => {
    setInitialMessage(message);
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-10">
        GrandPrix GPT
      </h1>
      
      {initialMessage === null ? (
        <Chat onSubmit={handleChatSubmit} />
      ) : (
        <ChatConversation initialMessage={initialMessage} />
      )}
    </main>
  )
} 