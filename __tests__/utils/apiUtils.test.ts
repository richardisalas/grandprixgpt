import { formatChatMessages, createChatCompletionRequest, processStreamResponse } from '../../app/utils/apiUtils';

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
  
  describe('processStreamResponse', () => {
    it('should process stream correctly', async () => {
      // Mock functions
      const onChunk = jest.fn();
      const onComplete = jest.fn();
      const onError = jest.fn();
      
      // Create a mock response with readable stream
      const mockValue = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in UTF-8
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: mockValue })
          .mockResolvedValueOnce({ done: true })
      };
      
      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      } as unknown as Response;
      
      // Process the stream
      await processStreamResponse(mockResponse, onChunk, onComplete, onError);
      
      // Assertions
      expect(mockReader.read).toHaveBeenCalled();
      expect(onChunk).toHaveBeenCalledWith('Hello');
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
    });
    
    it('should handle errors', async () => {
      // Mock functions
      const onChunk = jest.fn();
      const onComplete = jest.fn();
      const onError = jest.fn();
      
      // Create a mock response with error
      const mockReader = {
        read: jest.fn().mockRejectedValueOnce(new Error('Stream error'))
      };
      
      const mockResponse = {
        body: {
          getReader: () => mockReader
        }
      } as unknown as Response;
      
      // Process the stream
      await processStreamResponse(mockResponse, onChunk, onComplete, onError);
      
      // Assertions
      expect(onChunk).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}); 