import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Setup ReadableStream mock if not available in test environment
if (typeof ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {
    constructor(options) {
      this.controller = null;
      if (options && options.start) {
        this.controller = { 
          enqueue: jest.fn(),
          close: jest.fn()
        };
        options.start(this.controller);
      }
    }
  };
}

// Reset mocks before each test
beforeEach(() => {
  global.fetch.mockReset();
}); 