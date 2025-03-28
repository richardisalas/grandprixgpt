import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatChatMessages } from '../../utils/apiUtils';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming request body to get the messages
    const { messages } = await request.json();
    console.log('Received request with message count:', messages.length);
    console.log('Full messages array:', JSON.stringify(messages, null, 2));

    // Basic validation: Check if messages array exists and is not empty
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1]?.content;
    console.log('Latest message:', latestMessage);

    // 2. Initialize OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable not set.');
      return NextResponse.json({ error: 'Server configuration error: Missing API key.' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 3. Format messages for the OpenAI API
    const formattedMessages = formatChatMessages(messages);
    console.log('Formatted messages for OpenAI:', JSON.stringify(formattedMessages, null, 2));

    // 4. Call OpenAI and accumulate the response
    let fullResponseText = "";
    let chunkCount = 0;

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: formattedMessages,
        stream: true,
        temperature: 0.7,
      });

      // Loop through the OpenAI stream chunks and accumulate the content
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          chunkCount++;
          const sanitizedText = text
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase
          fullResponseText += sanitizedText;
        }
      }

      console.log(`Processed ${chunkCount} chunks from OpenAI`);
      console.log("Final assembled response:", fullResponseText);

      // 5. Return the complete response to the client
      return new NextResponse(fullResponseText, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });

    } catch (err: any) {
      console.error('OpenAI API or stream processing error:', err);
      const errorMessage = err.response?.data?.error?.message || err.message || 'Error generating response';
      return NextResponse.json(
        { error: `OpenAI error: ${errorMessage}` },
        { status: err.status || 500 }
      );
    }

  } catch (error: any) {
    console.error('Chat API endpoint general error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request due to server error.' },
      { status: 500 }
    );
  }
} 