import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatChatMessages } from '../../utils/apiUtils';

import { DataAPIClient } from "@datastax/astra-db-ts"

// Model selection flag - set to 'openai' or 'gemini'
const USE_MODEL: 'openai' | 'gemini' = 'gemini';

// Environment variables
const {
  ASTRADB_DB_NAMESPACE,
  ASTRADB_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable not set.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini client
if (!process.env.GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY environment variable not set.');
}

const genAI = process.env.GOOGLE_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;
const geminiModel = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });

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
      
      IMPORTANT FORMATTING RULES:
      1. Always display only the first two digits of any point values when discussing driver standings.
         For example, if a driver has 442 points, display it as 44 points. If they have 363 points, display it as 36 points.
      2. Always include a space between words and numbers (e.g., "in 2025" not "in2025")
      3. Use consistent bullet points formatting with proper spacing
      4. Ensure all headers and sections are properly formatted with markdown
      5. Check that all sentences are complete and not cut off

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

    // Set up encoding for streaming
    const encoder = new TextEncoder();

    if (USE_MODEL === 'openai') {
      // OpenAI streaming implementation
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [template, ...messages],
        stream: true,
        temperature: 0.7,
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
    } else if (USE_MODEL === 'gemini' && geminiModel) {
      // Gemini implementation
      try {
        // Format messages for Gemini (convert from OpenAI format)
        const geminiMessages = messages.map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

        // Add system prompt as a user message (Gemini doesn't support system role)
        geminiMessages.unshift({
          role: 'user',
          parts: [{ text: template.content }]
        });

        // Start the chat
        const chat = geminiModel.startChat({
          history: geminiMessages.slice(0, -1), // Add all but last message to history
        });

        // Send the last message to get streaming response
        const lastMsg = geminiMessages[geminiMessages.length - 1];
        const result = await chat.sendMessageStream(lastMsg.parts[0].text);

        // Stream the response
        return new Response(
          new ReadableStream({
            async start(controller) {
              try {
                for await (const chunk of result.stream) {
                  const text = chunk.text();
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                }
              } catch (error) {
                console.error("Gemini stream processing error:", error);
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
      } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
      }
    } else {
      return NextResponse.json(
        { error: 'Model configuration error' },
        { status: 500 }
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