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
                limit: 10
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