import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
  });
  return response.data[0].embedding;
};
