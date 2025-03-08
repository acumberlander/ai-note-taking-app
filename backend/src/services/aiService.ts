import { OpenAI } from "openai";
import { Note } from "../models/noteModel";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates an embedding for the note's content using OpenAI.
 * @param text
 * @returns
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!text || text.trim().length === 0) {
    throw new Error("Invalid input: text cannot be empty");
  }
  try {
    const response = await openai.embeddings.create({
      input: text,
      model: "text-embedding-ada-002",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
};

/**
 * Determines the intent of the query.
 * @param query
 * @returns
 */
export const classifyIntent = async (
  query: string
): Promise<"show_all" | "search" | "create_note" | "request"> => {
  const systemPrompt = `
  You are an intent classification assistant for a note-taking app.
  You will receive a user query. Your job is to classify the query into one of these two categories:
  You will receive a user query. Your job is to classify the query into one of these four categories:
  1. "show_all" - if the user wants to see all their notes (examples: "show me all notes", "list everything", "display all my notes").
  2. "search" - if the user wants to search for something specific (examples: "find notes about AI", "show me notes about meetings").
  Only return "show_all" or "search" as the response. No explanation, no other text.
  3. "create_note" - if the user wants to create a new note with some content they define/dictate (examples: "write this down", "create a note that says" )
  4. "request" - if the user wants you to be inventive and write an answer. ("can you write a grocery list for me with healthy items?", "Please create a good schedule for workouts I can do on leg day")
  Only return "show_all" or "search" or "create_note" or "request" as the response. No explanation, no other text.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    max_tokens: 10,
  });

  const classification = completion.choices[0]?.message?.content?.trim();

  if (classification === "show_all") return "show_all";
  if (classification === "create_note") return "create_note";
  if (classification === "request") return "request";
  return "search";
};

/**
 *
 * @param query
 * @param notes
 * @returns
 */
export async function generateQueryResponse(
  query: string,
  intent: string,
  notes: Note[]
): Promise<string> {
  const noteTitles = notes.map((n) => `${n.title}`).join(", ");
  const systemPrompt = `
You are an AI assistant in a note-taking app.
The user asked: "${query}"

You will give a response in reference to what the user asked.
1. If the user is asking 

The app found these notes that are relevant to the request: ${noteTitles}

Please write a short, friendly response summarizing this like:
"Here are all your notes that pertain to [some brief summary of the query]."

Keep the response under 100 characters.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    max_tokens: 10,
  });

  return (
    completion.choices[0]?.message?.content?.trim() || "Here are your notes."
  );
}

export async function generateTitle(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates short, concise titles for given text.
            You do not put quotation around the title.`,
        },
        {
          role: "user",
          content: `Generate a short and relevant title for the following note: "${content}"`,
        },
      ],
      max_tokens: 10, // Keep it short
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error generating title:", error);
    return "";
  }
}

export async function generateContent(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates 200 words or less for a request a user gives. They will want a note about the given topic. Could be a list or a paragraph or any suitable response.",
        },
        {
          role: "user",
          content: `Generate some content for the following request: "${query}"`,
        },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error generating content:", error);
    return "";
  }
}

export const trimCommand = async (query: string): Promise<string> => {
  const systemPrompt = `
  Extract only the content of the note from the user's speech. Remove any command-like phrases.
  Be very exact with the remaining content, copying it word for word.
  `;

  const extractionResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    max_tokens: 10,
  });

  const extractionContent =
    extractionResponse.choices[0]?.message?.content?.trim();

  return extractionContent || "No Content Found";
};
