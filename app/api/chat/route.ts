import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatChatMessages } from '../../utils/apiUtils';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // Initialize OpenAI client with API key from environment variable
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Format messages for OpenAI
    const formattedMessages = formatChatMessages(messages);

    // Create streaming response
    const response = new Response(
      new ReadableStream({
        async start(controller) {
          try {
            const stream = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: formattedMessages,
              stream: true,
            });

            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
            controller.close();
          } catch (err) {
            console.error('Stream error:', err);
            controller.enqueue(new TextEncoder().encode('Error generating response'));
            controller.close();
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 