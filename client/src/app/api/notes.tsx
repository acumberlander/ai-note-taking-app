import type { NextApiRequest, NextApiResponse } from "next";

type Note = {
  id?: number;
  title: string;
  content: string;
};

const notes: Note[] = [
  { title: "First Note", content: "This is a sample note" },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(notes);
  } else if (req.method === "POST") {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" });
    }
    const newNote = { title, content };
    notes.push(newNote);
    res.status(201).json(newNote);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    const index = notes.findIndex((note) => note.id === id);
    if (index === -1) return res.status(404).json({ error: "Note not found" });
    notes.splice(index, 1);
    res.status(200).json({ message: "Note deleted" });
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
