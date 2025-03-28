import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from '../../app/components/Chat';

// Mock the text decoder
const mockTextDecoder = {
  decode: jest.fn().mockReturnValue('Hello, I am an AI assistant.')
};
global.TextDecoder = jest.fn(() => mockTextDecoder);

// Mock scrollIntoView which doesn't exist in JSDOM
Element.prototype.scrollIntoView = jest.fn();

describe('Chat Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the readable stream and reader
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({ done: false, value: new Uint8Array([]) })
        .mockResolvedValueOnce({ done: true })
    };
    
    global.fetch.mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader
      }
    });
  });

  it('renders the chat interface', () => {
    render(<Chat />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('handles user input and submission', async () => {
    const mockOnSubmit = jest.fn();
    render(<Chat onSubmit={mockOnSubmit} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Type in the input
    await userEvent.type(input, 'Hello, AI!');
    expect(input).toHaveValue('Hello, AI!');
    
    // Submit the form
    fireEvent.click(submitButton);
    
    // Check if onSubmit was called with the message
    expect(mockOnSubmit).toHaveBeenCalledWith('Hello, AI!');
    
    // Check if input is cleared
    expect(input).toHaveValue('');
    
    // Verify user message is displayed
    await waitFor(() => {
      expect(screen.getByText('Hello, AI!')).toBeInTheDocument();
    });
    
    // Verify response is displayed
    await waitFor(() => {
      expect(screen.getByText('Hello, I am an AI assistant.')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock fetch to return an error
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Chat />);
    
    // Submit a message
    const input = screen.getByPlaceholderText('Type your message...');
    await userEvent.type(input, 'This will cause an error');
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Sorry, there was an error processing your request.')).toBeInTheDocument();
    });
  });
}); 