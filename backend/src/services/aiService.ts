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
): Promise<"show_all" | "search"> => {
  const systemPrompt = `
You are an intent classification assistant for a note-taking app.
You will receive a user query. Your job is to classify the query into one of these two categories:
1. "show_all" - if the user wants to see all their notes (examples: "show me all notes", "list everything", "display all my notes").
2. "search" - if the user wants to search for something specific (examples: "find notes about AI", "show me notes about meetings").
Only return "show_all" or "search" as the response. No explanation, no other text.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    max_tokens: 10,
  });

  const classification = completion.choices[0]?.message?.content?.trim();

  if (classification === "show_all") return "show_all";
  return "search";
};

/**
 *
 * @param query
 * @param notes
 * @returns
 */
export async function generateSearchResponse(
  query: string,
  notes: Note[]
): Promise<string> {
  const noteTitles = notes.map((n) => `"${n.title}"`).join(", ");
  const systemPrompt = `
You are an AI assistant in a note-taking app.
The user asked: "${query}"

The app found these notes that are relevant to the request: ${noteTitles}

Please write a short, friendly response summarizing this like:
"Here are all your notes that pertain to [some brief summary of the query]."

Keep the response under 100 characters.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    max_tokens: 100,
  });

  return (
    completion.choices[0]?.message?.content?.trim() || "Here are your notes."
  );
}
