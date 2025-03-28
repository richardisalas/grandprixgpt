"use client"

import React, { useState, useRef, useEffect } from 'react';
import { createChatCompletionRequest, processStreamResponse } from '../utils/apiUtils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatConversationProps {
  initialMessage: string;
  onClose?: () => void;
}

export default function ChatConversation({ initialMessage, onClose }: ChatConversationProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{ role: 'user', content: initialMessage }]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading since we're sending the initial message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send the initial message on component mount
  useEffect(() => {
    const sendInitialMessage = async () => {
      try {
        // Send request to our API endpoint
        const response = await fetch('/api/chat', createChatCompletionRequest([{ role: 'user', content: initialMessage }]));
        
        if (!response.ok) {
          throw new Error('Failed to get response');
        }
        
        // Add initial empty assistant message
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
        
        // Process the stream
        await processStreamResponse(
          response,
          // On each chunk, update the last message
          (text) => {
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              newMessages[newMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + text
              };
              return newMessages;
            });
          },
          // On complete
          () => {},
          // On error
          (error) => {
            console.error('Stream error:', error);
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: 'Sorry, there was an error processing your request.' 
            }]);
          }
        );
      } catch (error) {
        console.error('Error:', error);
        // Add error message
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your request.' 
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    sendInitialMessage();
  }, [initialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading state
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare messages for API
      const apiMessages = [...messages, userMessage];
      
      // Send request to our API endpoint
      const response = await fetch('/api/chat', createChatCompletionRequest(apiMessages));
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      // Add initial empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      // Process the stream
      await processStreamResponse(
        response,
        // On each chunk, update the last message
        (text) => {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + text
            };
            return newMessages;
          });
        },
        // On complete
        () => {},
        // On error
        (error) => {
          console.error('Stream error:', error);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Sorry, there was an error processing your request.' 
          }]);
        }
      );
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[600px]">
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-100 ml-auto max-w-[80%]' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 rounded-full bg-transparent shadow-sm border border-gray-300 focus:outline-none focus:shadow-md"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center bg-transparent text-gray-500 rounded-full shadow-sm border border-gray-300 hover:shadow-md focus:outline-none disabled:opacity-50"
          aria-label="Send message"
          disabled={isLoading}
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