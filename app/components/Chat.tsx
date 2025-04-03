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

  const suggestedQuestions = [
    "Who will win the next race?",
    "Who are the top 3 drivers this season?",
    "Tell me about the Monaco Grand Prix",
    "Which team has the best car this season?"
  ];

  const handleSuggestedQuestionClick = (question: string) => {
    onSubmit?.(question);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-8 grid grid-cols-2 gap-3">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedQuestionClick(question)}
            className="text-left px-5 py-3 bg-transparent backdrop-blur-sm border border-gray-300 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200 text-gray-600 placeholder:text-gray-400 text-sm truncate"
          >
            {question}
          </button>
        ))}
      </div>
      
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
          className="w-10 h-10 flex items-center justify-center bg-transparent text-gray-500 rounded-full shadow-sm border border-gray-300 hover:shadow-md focus:outline-none"
          aria-label="Send message"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </button>
      </form>
    </div>
  );
} 