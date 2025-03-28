# GrandPrixGPT

A ChatGPT-like web application with a modern tech stack.

## Getting Started

### Prerequisites

- Node.js v18.18.0 or later
- MongoDB (local instance or MongoDB Atlas account)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/grandprixgpt.git
cd grandprixgpt
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- Real-time chat interface
- AI-powered responses using OpenAI's GPT models
- User authentication
- Conversation history
- Responsive design

## Tech Stack

The complete tech stack is documented in [tech-stack.md](./tech-stack.md).

## Project Structure

```
/
├── app/                # Next.js App Router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── chat/           # Chat interface
│   └── page.tsx        # Home page
├── components/         # React components
├── lib/                # Utility functions
├── models/             # MongoDB schemas
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## License

MIT 