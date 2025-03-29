"use client"

import React, { useState, useRef, useEffect } from 'react';
import { createChatCompletionRequest, processStreamResponse } from '../utils/apiUtils';
import { formatStructuredText } from '../utils/formatUtils';

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
  // Initialize with the initial message as the first user message
  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: initialMessage }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const initialMessageSent = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Format content for display
  const formatContent = (content: string, role: 'user' | 'assistant'): React.ReactNode => {
    if (role === 'user') {
      return content
        .replace(/<[^>]*>/g, '')
        .replace(/([a-z])([A-Z])/g, '$1 $2');
    } else {
      // For assistant messages, use our structured formatting
      const formattedHtml = formatStructuredText(content);
      return <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Send initial message only once
  useEffect(() => {
    if (!initialMessageSent.current) {
      initialMessageSent.current = true;
      setIsLoading(true);
      
      // Use the messages array that contains the initial message
      const initialMessages = [{ role: 'user' as const, content: initialMessage }];
      sendInitialMessage(initialMessages);
    }
  }, [initialMessage]);

  const sendInitialMessage = async (initialMessages: Message[]) => {
    try {
      console.log('Sending initial message to API:', JSON.stringify(initialMessages, null, 2));
      
      // Send request to API with the initial message
      const response = await fetch('/api/chat', createChatCompletionRequest(initialMessages));
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      // Add initial empty assistant message
      console.log('Adding empty assistant message');
      setMessages(prev => {
        return [...prev, { role: 'assistant' as const, content: '' }];
      });
      
      // Process the stream
      await processStreamResponse(
        response,
        (text) => {
          console.log('Received chunk:', text);
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role !== 'assistant') {
              console.log('Unexpected message role in stream processing');
              return prev;
            }
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: lastMessage.content + text
            };
            return newMessages;
          });
        },
        () => {
          console.log('Stream complete');
        },
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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageContent: string, existingMessages: Message[]) => {
    try {
      // Check for duplicate messages
      if (existingMessages.length > 0) {
        const lastMessage = existingMessages[existingMessages.length - 1];
        if (lastMessage.content === messageContent && lastMessage.role === 'user') {
          console.log('Duplicate message detected, skipping');
          return;
        }
      }

      // First update UI with the new user message
      const updatedMessages = [...existingMessages, { role: 'user' as const, content: messageContent }];
      setMessages(updatedMessages);
      
      console.log('Sending messages to API:', JSON.stringify(updatedMessages, null, 2));
      
      // Send request to API with all messages
      const response = await fetch('/api/chat', createChatCompletionRequest(updatedMessages));
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      // Add initial empty assistant message
      console.log('Adding empty assistant message');
      setMessages(prev => {
        const newMessages = [...prev, { role: 'assistant' as const, content: '' }];
        console.log('Current messages state:', JSON.stringify(newMessages, null, 2));
        return newMessages;
      });
      
      // Process the stream
      await processStreamResponse(
        response,
        (text) => {
          console.log('Received chunk:', text);
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role !== 'assistant') {
              console.log('Unexpected message role in stream processing');
              return prev;
            }
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: lastMessage.content + text
            };
            return newMessages;
          });
        },
        () => {
          console.log('Stream complete');
        },
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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    setInput('');
    setIsLoading(true);
    await sendMessage(input.trim(), messages);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[600px]">
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-white/30 backdrop-blur-sm' 
                  : 'bg-white/10 backdrop-blur-sm formatted-content'
              }`}
            >
              {formatContent(msg.content, msg.role)}
            </div>
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
          className="flex-grow px-4 py-2 rounded-full bg-transparent backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-shadow"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center bg-transparent backdrop-blur-sm text-gray-500 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-gray-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] focus:outline-none disabled:opacity-50 transition-shadow"
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