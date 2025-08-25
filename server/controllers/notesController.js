const Note = require("../models/notesModel");
const { ObjectId } = require("mongodb");
const DOMPurify = require("isomorphic-dompurify");

// ✅ Create Note (Any authenticated user can create notes)
const createNote = async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    if (!title || !subject || !content) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const sanitizedContent = DOMPurify.sanitize(content);

    const newNote = new Note({
      title,
      subject,
      content: sanitizedContent,
      createdBy: req.user._id, // Associate note with the logged-in user
      createdAt: new Date(),
    });

    await newNote.save();
    res.status(201).json({ message: "Note created successfully!", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Get Notes by Subject (Any authenticated user)
const getNotesBySubject = async (req, res) => {
  try {
    // Users can see all notes by subject, or modify to show only their notes:
    // const notes = await Note.find({ subject: req.params.subject, createdBy: req.user._id }).sort({ createdAt: -1 });
    const notes = await Note.find({ subject: req.params.subject }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Edit Note (Users can edit their own notes, admins can edit any note)
const editNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    // Check if note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // Check if user owns the note OR is admin
    // Note: Using createdBy instead of userId based on your model
    if (note.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to edit this note" });
    }
    
    // Update the note
    note.title = req.body.title || note.title;
    note.subject = req.body.subject || note.subject;
    note.content = DOMPurify.sanitize(req.body.content || note.content);

    await note.save();
    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error editing note:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Note (Users can delete their own notes, admins can delete any note)
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user owns the note OR is admin
    if (note.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this note" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Notes (Show user's own notes, or all notes if admin)
const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    // If user is not admin, show only their notes
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }
    // If admin, show all notes (query remains empty)

    const notes = await Note.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// ✅ Get Single Note by ID (Any authenticated user can view notes)
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Optional: Restrict to user's own notes only
    // if (note.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: "Not authorized to view this note" });
    // }

    res.status(200).json({ note });
  } catch (error) {
    console.error("Error in getNoteById:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNote,
  getNotesBySubject,
  editNote,
  deleteNote,
  getNotes,
  getNoteById
};