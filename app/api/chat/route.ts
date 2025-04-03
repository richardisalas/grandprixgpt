import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatChatMessages } from '../../utils/apiUtils';

 import { DataAPIClient } from "@datastax/astra-db-ts"

// Environment variables
const {
  ASTRADB_DB_NAMESPACE,
  ASTRADB_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env

// 2. Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable not set.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize AstraDB client if credentials are available
const client = ASTRA_DB_APPLICATION_TOKEN ? new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN) : null
const db = client && ASTRA_DB_API_ENDPOINT ? client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRADB_DB_NAMESPACE || "default_keyspace" }) : null

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

    // Get context from vector database
    let docContext = ""
    try {
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        })
        console.log("Created embeddings successfully");

        if (db && ASTRADB_DB_COLLECTION) {
            const collection = await db.collection(ASTRADB_DB_COLLECTION)
            const cursor = collection.find({}, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 20
            })  

            const documents = await cursor.toArray()
            console.log("Retrieved documents count:", documents?.length || 0)
            console.log("Retrieved documents:", JSON.stringify(documents, null, 2))
            
            const docsMap = documents?.map(doc => doc.text)
            console.log("Mapped document texts:", JSON.stringify(docsMap, null, 2))
            docContext = JSON.stringify(docsMap)
        } else {
            console.warn("Database not initialized. Using empty context.")
        }
    } catch (error) {
        console.error("Error querying database:", error)
        docContext = ""
    }

    // add context to the messages
    const template = {
      role: "system",
      content: `You are an AI assistant who knows everything about Formula 1 and are able to predict race finishes based on the data provided. 
      Use the below context to augment what you know about Formula One racing.
      The context will provide you with the most recent F1 data.

      If the context doesn't include the information you need to answer based on
      your existing knowledge and don't mention the source of your information or 
      what the context does or doesn't include.

      Format responses using markdown where applicable and don't return images.

      If asked about which team will win generate a detail report and take the following into account:

      Qualifying position is important, espically if the track is difficult to overtake on or the weather is bad.

      Car performance in 2025 and team performance in 2025 so far.
      
      Driver form and histroic results in the race matter too.

      Relevant driver news, and team chemistry into account.

      Output a conclusion with your reasoning and predicted podium finishes.

      ----------
      START CONTEXT
      ${docContext}
      END CONTEXT
      ----------
      QUESTION: ${latestMessage}
      ----------
      `
  }

    // 3. Format messages for the OpenAI API
    const formattedMessages = formatChatMessages(messages);
    console.log('Formatted messages for OpenAI:', JSON.stringify(formattedMessages, null, 2));

    // 4. Set up streaming response
    const encoder = new TextEncoder();
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      // messages: formattedMessages,
      messages: [template, ...messages],
      stream: true,
      temperature: 0.7,
      // reasoning_effort: "medium" 
    });

    // Create a ReadableStream to send the response in chunks
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                const sanitizedText = text
                  .replace(/<[^>]*>/g, ''); // Remove HTML tags only
                
                controller.enqueue(encoder.encode(sanitizedText));
              }
            }
          } catch (error) {
            console.error("Stream processing error:", error);
            controller.error(error);
          } finally {
            controller.close();
          }
        }
      }),
      {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      }
    );

  } catch (error: any) {
    console.error('Chat API endpoint general error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request due to server error.' },
      { status: 500 }
    );
  }
} 