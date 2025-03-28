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

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = new TextDecoder().decode(value);
      onChunk(text);
    }
    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}; 