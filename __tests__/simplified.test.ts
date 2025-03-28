import { formatChatMessages, createChatCompletionRequest } from '../app/utils/apiUtils';

describe('API Utilities', () => {
  describe('formatChatMessages', () => {
    it('should format valid roles correctly', () => {
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' },
        { role: 'system', content: 'System prompt' }
      ];
      
      const result = formatChatMessages(messages);
      expect(result).toEqual(messages);
    });
    
    it('should convert invalid roles to user', () => {
      const messages = [
        { role: 'invalid', content: 'Hello' },
        { role: 'unknown', content: 'Unknown prompt' }
      ];
      
      const result = formatChatMessages(messages);
      expect(result).toEqual([
        { role: 'user', content: 'Hello' },
        { role: 'user', content: 'Unknown prompt' }
      ]);
    });
  });
  
  describe('createChatCompletionRequest', () => {
    it('should create a valid request object', () => {
      const messages = [
        { role: 'user', content: 'Hello' }
      ];
      
      const result = createChatCompletionRequest(messages);
      
      expect(result).toEqual({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formatChatMessages(messages)
        }),
      });
    });
  });
}); 