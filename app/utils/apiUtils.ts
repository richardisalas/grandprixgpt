/**
 * Utility functions for API communications
 */

// OpenAI message types for better type safety
type ChatRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: string; 
  content: string;
}

interface OpenAIMessage {
  role: ChatRole;
  content: string;
}

/**
 * Formats chat messages for the OpenAI API
 */
export const formatChatMessages = (messages: ChatMessage[]): OpenAIMessage[] => {
  return messages.map(({ role, content }) => ({
    role: (role === 'user' || role === 'assistant' || role === 'system') 
      ? role as ChatRole 
      : 'user',
    content
  }));
};

/**
 * Creates a chat completion request
 */
export const createChatCompletionRequest = (messages: ChatMessage[]) => {
  // Safety check - ensure messages is at least an array with one message
  if (!messages || messages.length === 0) {
    console.error('No messages provided to createChatCompletionRequest');
    // Provide a default fallback message
    messages = [{ role: 'user', content: 'Hello' }];
  }

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: formatChatMessages(messages)
    }),
  };
};

/**
 * Process stream response from chat API
 */
export const processStreamResponse = async (
  response: Response,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    if (!response.body) {
      throw new Error('Response body is not readable');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    console.log('Starting to process stream response');

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('Stream done');
        onComplete();
        break;
      }

      // Decode the chunk
      const text = decoder.decode(value);
      
      // Process the chunk if it contains content
      if (text.trim()) {
        console.log('Received chunk:', text);
        onChunk(text);
      }
    }
  } catch (error) {
    console.error('Error processing stream:', error);
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}; 