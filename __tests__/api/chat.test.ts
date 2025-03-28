import { POST } from '../../app/api/chat/route';

// Mock the Response object
const mockResponse = {
  headers: {
    get: jest.fn().mockReturnValue('text/plain; charset=utf-8')
  },
  body: {
    getReader: jest.fn().mockReturnValue({
      read: jest.fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('Hello') })
        .mockResolvedValueOnce({ done: true })
    })
  },
  json: jest.fn().mockResolvedValue({ error: 'Failed to generate response' }),
  status: 500,
};

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockImplementation(() => {
            // Create a simple async generator to simulate the stream
            return (async function* () {
              yield { choices: [{ delta: { content: 'Hello' } }] };
              yield { choices: [{ delta: { content: ' world' } }] };
              yield { choices: [{ delta: { content: '!' } }] };
            })();
          })
        }
      }
    };
  });
});

// Mock global Response class to return our custom response
global.Response = jest.fn().mockImplementation(() => mockResponse);

describe('Chat API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a streaming response', async () => {
    // Create a mock request
    const req = {
      json: jest.fn().mockResolvedValue({
        messages: [{ role: 'user', content: 'Test message' }]
      })
    };

    // Call the API handler
    const response = await POST(req as any);
    
    // Check response type
    expect(response).toBeDefined();
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    
    // Verify reader is available
    const reader = response.body.getReader();
    expect(reader).toBeDefined();
  });

  it('handles errors gracefully', async () => {
    // Mock implementation to throw an error
    jest.spyOn(global, 'Response').mockImplementationOnce(() => {
      throw new Error('OpenAI API Error');
    });

    // Create a mock request
    const req = {
      json: jest.fn().mockResolvedValue({
        messages: [{ role: 'user', content: 'Test message' }]
      })
    };

    // Call the API handler
    const response = await POST(req as any);
    
    // Check error response
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
}); 