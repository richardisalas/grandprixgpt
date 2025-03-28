"use client"

import React, { useState } from 'react';

interface ChatProps {
  onSubmit?: (message: string) => void;
}

export default function Chat({ onSubmit }: ChatProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit?.(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 rounded-full bg-transparent shadow-sm border border-gray-300 focus:outline-none focus:shadow-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-transparent text-gray-800 rounded-full shadow-sm border border-gray-300 hover:shadow-md focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
} 