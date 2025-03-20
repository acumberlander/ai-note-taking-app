"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSimilarNotes = exports.semanticEditNotes = exports.isNoteRelevant = exports.trimCommand = exports.classifyIntent = exports.generateEmbedding = void 0;
exports.generateQueryResponse = generateQueryResponse;
exports.generateTitle = generateTitle;
exports.generateContent = generateContent;
const openai_1 = require("openai");
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
/**
 * Generates an embedding for the note's content using OpenAI.
 * @param text
 * @returns
 */
const generateEmbedding = async (text) => {
    if (!text || text.trim().length === 0) {
        throw new Error("Invalid input: text cannot be empty");
    }
    try {
        const response = await openai.embeddings.create({
            input: text,
            model: "text-embedding-ada-002",
        });
        return response.data[0].embedding;
    }
    catch (error) {
        console.error("Error generating embedding:", error);
        throw new Error("Failed to generate embedding");
    }
};
exports.generateEmbedding = generateEmbedding;
/**
 * Determines the intent of the query.
 * @param query
 * @returns
 */
const classifyIntent = async (query) => {
    const systemPrompt = `
  You are an intent classification assistant for a note-taking app.
  You will receive a user query. Your job is to classify the query into one of these categories:
  1. "show_all" - if the user wants to see all their notes (examples: "show me all notes", "list everything", "display all my notes").
  2. "search" - if the user wants to search for something specific (examples: "find notes about AI", "show me notes about meetings").
  3. "create_note" - if the user wants to create a new note with some content they define/dictate (examples: "write this down", "create a note that says" )
  4. "request" - if the user wants you to be inventive and write an answer. ("can you write a grocery list for me with healthy items?", "Please create a good schedule for workouts I can do on leg day")
  5. "delete_notes" - if the user wants you to delete notes based on the content they define/dictate (examples: "delete notes related to health", "get rid of notes that talk about food", "remove notes that mention technology")
  6. "delete_all" - if the user wants to delete ALL their notes without any specific criteria (examples: "delete all my notes", "remove everything", "clear all notes", "get rid of all my notes")
  7. "edit_notes" - if the user wants to modify or update existing notes (examples: "edit my notes about food to include peanut allergy", "update appointment notes to mention my car isn't working", "revise travel notes to include the new flight time")
  
  Only return one of these exact strings as the response: "show_all", "search", "create_note", "request", "delete_notes", "delete_all", or "edit_notes". No explanation or other text.
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
    if (classification === "show_all")
        return "show_all";
    if (classification === "create_note")
        return "create_note";
    if (classification === "delete_notes") {
        console.log("delete intent");
        return "delete_notes";
    }
    if (classification === "delete_all") {
        console.log("delete all intent");
        return "delete_all";
    }
    if (classification === "edit_notes") {
        console.log("edit intent");
        return "edit_notes";
    }
    if (classification === "request")
        return "request";
    return "search";
};
exports.classifyIntent = classifyIntent;
/**
 *
 * @param query
 * @param notes
 * @returns
 */
async function generateQueryResponse(query, intent, notes) {
    const noteTitles = notes.map((n) => `${n.title}`).join(", ");
    const systemPrompt = `
You are an AI assistant in a note-taking app.
The user asked: "${query}"
The detected intent is: "${intent}"

You will give a response in reference to what the user asked.
${notes.length === 0
        ? `No notes were found matching the user's query. Respond with a message like:
  "Sorry, I couldn't find any notes related to [brief topic]. Try adjusting the sensitivity to see more results."`
        : `Based on the intent:
  - For "show_all": Mention you're showing all their notes
  - For "search": Mention you found notes matching their search
  - For "create_note": Confirm the note was created with a message like "I've created your note about [brief topic]"
  - For "delete_notes": Confirm which notes were found for deletion
  - For "delete_all": Confirm all notes are ready for deletion
  - For "edit_notes": Say something like "Here are the notes you want to edit."
  - For "request": Confirm you created content based on their request with a message like "I've created a note with [brief description]"

  The app found these notes that are relevant to the request: ${noteTitles}

  Please write a short, friendly response summarizing this like:
  "Here are the notes that match your [intent-specific action] about [brief summary of query]."`}

Keep the response under 100 characters.
`;
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
        ],
        max_tokens: 200,
    });
    return (completion.choices[0]?.message?.content?.trim() ||
        (notes.length === 0
            ? "Sorry, I couldn't find any notes matching your query. Try adjusting the sensitivity."
            : "Here are your notes."));
}
async function generateTitle(content) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that generates short, concise titles for given text.
            You do not put quotation around the title.
            DO NOT use any markdown syntax in the title.
            The title should be plain text only, without any special formatting characters.`,
                },
                {
                    role: "user",
                    content: `Generate a short and relevant plain text title (NO MARKDOWN) for the following note: "${content}"`,
                },
            ],
            max_tokens: 50,
        });
        return response.choices[0]?.message?.content?.trim() || "";
    }
    catch (error) {
        console.error("Error generating title:", error);
        return "";
    }
}
async function generateContent(query) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates well-formatted plain text content for notes. " +
                        "DO NOT use any markdown syntax like #, *, _, -, or backticks. " +
                        "Format your response as plain text only. " +
                        "For lists: " +
                        "- Use simple numbers or letters followed by periods (1., 2., a., b.) " +
                        "- Use simple bullet characters like • or - " +
                        "- Do not use markdown formatting for lists " +
                        "For emphasis: Use ALL CAPS instead of bold or italic markdown " +
                        "For sections: Use plain text headings followed by line breaks, not markdown headings " +
                        "Keep your response concise and focused on the user's request.",
                },
                {
                    role: "user",
                    content: `Generate well-formatted plain text content (NO MARKDOWN) for the following request: "${query}"`,
                },
            ],
            max_tokens: 200,
        });
        return response.choices[0]?.message?.content?.trim() || "";
    }
    catch (error) {
        console.error("Error generating content:", error);
        return "";
    }
}
const trimCommand = async (query) => {
    const systemPrompt = `
  Extract only the content of the note from the user's speech. Remove any command-like phrases.
  Be very exact with the remaining content, copying it word for word. Typical command words or phrases would include the following:
  "delete", "show", "delete my notes", "remove", "display", "edit", "update", "revise".
  `;
    const extractionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
        ],
        max_tokens: 20,
    });
    const extractionContent = extractionResponse.choices[0]?.message?.content?.trim();
    return extractionContent || "No Content Found";
};
exports.trimCommand = trimCommand;
/**
 * Determines if a note is relevant to the user's query
 * @param query The user's query
 * @param note The note to check for relevance
 * @returns Boolean indicating if the note is relevant
 */
const isNoteRelevant = async (query, note) => {
    try {
        const systemPrompt = `
    You are an AI assistant determining if a note is relevant to a user's edit request.
    The user has requested: "${query}"
    
    Analyze the following note and determine if it's relevant to this edit request.
    Only respond with "relevant" or "not relevant" - no other text.
    `;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `Note title: "${note.title}"\nNote content: "${note.content}"`,
                },
            ],
            max_tokens: 10,
            temperature: 0.25,
        });
        const result = completion.choices[0]?.message?.content
            ?.trim()
            .toLowerCase();
        return result === "relevant";
    }
    catch (error) {
        console.error("Error checking note relevance:", error);
        return true; // Default to including the note if there's an error
    }
};
exports.isNoteRelevant = isNoteRelevant;
/**
 * Edits notes based on the user's query. This function takes a collection of notes
 * and edits their content according to the instruction in the query.
 * @param query The user's query containing edit instructions
 * @param notes Array of notes to be edited
 * @returns Array of edited notes
 */
const semanticEditNotes = async (query, notes) => {
    if (notes.length === 0)
        return [];
    // Filter notes for relevance first
    const relevantNotes = [];
    for (const note of notes) {
        const isRelevant = await (0, exports.isNoteRelevant)(query, note);
        if (isRelevant) {
            relevantNotes.push(note);
        }
    }
    if (relevantNotes.length === 0)
        return [];
    const systemPrompt = `
  You are an AI assistant helping to edit notes in a note-taking app.
  The user has requested: "${query}"
  
  I'll provide you with the content of each note, and you should modify it according to the user's request.
  Make targeted changes that align with the user's intent, while preserving the overall structure and purpose of each note.
  Only make changes that are relevant to the user's request - don't modify unrelated content.
  
  IMPORTANT: 
  - DO NOT use any markdown syntax in your response
  - Format your response as plain text only
  - Do not use #, *, _, -, or backticks for formatting
  - For emphasis, use ALL CAPS instead of bold or italic markdown
  - For sections, use plain text headings followed by line breaks, not markdown headings
  - For lists, use simple numbers or bullet characters (•, -) without markdown formatting
  
  Preserve the basic formatting in your response:
  - Maintain line breaks between paragraphs
  - For lists, ensure each item is on its own line with appropriate bullet points or numbers
  - Preserve any existing indentation or special formatting
  `;
    // Create a deep copy of the relevant notes array
    const editedNotes = JSON.parse(JSON.stringify(relevantNotes));
    for (let i = 0; i < relevantNotes.length; i++) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: `Original note content: "${relevantNotes[i].content}"
            
            Please edit this note according to the user's request: "${query}"`,
                    },
                ],
                max_tokens: 200,
            });
            const editedContent = completion.choices[0]?.message?.content?.trim();
            if (editedContent && editedContent !== relevantNotes[i].content) {
                editedNotes[i] = {
                    ...relevantNotes[i],
                    content: editedContent,
                };
            }
        }
        catch (error) {
            console.error(`Error editing note ${relevantNotes[i].id}:`, error);
        }
    }
    return editedNotes;
};
exports.semanticEditNotes = semanticEditNotes;
/**
 * Checks if content is similar to existing notes
 * @param contentOrQuery The content or query to check for similarity
 * @param notes Array of existing notes
 * @returns Array of similar notes
 */
const findSimilarNotes = async (contentOrQuery, notes) => {
    if (notes.length === 0)
        return [];
    try {
        const systemPrompt = `
    You are an AI assistant determining if notes are similar to a user's input.
    Analyze the following notes and determine if they contain similar information to what the user is trying to create.
    For each note, respond with only "similar" or "not similar" - no other text.
    Consider a note similar if it covers the same topic or contains substantially overlapping information with the input.
    `;
        const similarNotes = [];
        for (const note of notes) {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: `Input: "${contentOrQuery}"\nExisting note title: "${note.title}"\nExisting note content: "${note.content}"`,
                    },
                ],
                max_tokens: 10,
                temperature: 0.25,
            });
            const result = completion.choices[0]?.message?.content
                ?.trim()
                .toLowerCase();
            if (result === "similar") {
                similarNotes.push(note);
            }
            // Limit to 3 similar notes to avoid overwhelming the user
            if (similarNotes.length >= 3)
                break;
        }
        return similarNotes;
    }
    catch (error) {
        console.error("Error checking note similarity:", error);
        return [];
    }
};
exports.findSimilarNotes = findSimilarNotes;
