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
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is not readable');

    console.log('Starting to process stream response');
    let allChunks = ''; // Track all received chunks

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('Stream done. Complete text received:', allChunks);
        break;
      }

      // Decode the chunk and sanitize it by removing any HTML tags
      // and ensuring proper spacing between words
      const rawText = new TextDecoder().decode(value);
      console.log('Received raw chunk from stream:', rawText);
      
      // Process the text to ensure it's clean and properly formatted
      const cleanedText = rawText
        .replace(/<[^>]*>/g, '') // Remove any HTML tags
        .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between words that got merged
      
      console.log('Cleaned chunk:', cleanedText);
      allChunks += cleanedText;
      
      onChunk(cleanedText);
    }
    onComplete();
  } catch (error) {
    console.error('Error processing stream:', error);
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}; 