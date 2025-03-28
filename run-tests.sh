#!/bin/bash

# Run all tests
echo "Running all tests..."
npm test

# Run specific test files
echo "To run specific tests:"
echo "npm test -- __tests__/components/Chat.test.tsx"
echo "npm test -- __tests__/api/chat.test.ts"
echo "npm test -- __tests__/utils/apiUtils.test.ts"

# Run tests in watch mode
echo "To run tests in watch mode:"
echo "npm run test:watch" 