const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const { createNote, getNotesBySubject, editNote, deleteNote, getNotes, getNoteById } = require("../controllers/notesController");

const router = express.Router();

// ✅ Create a note (Any authenticated user can create notes)
router.post("/notes", authenticate, createNote);

// ✅ Get all notes (authenticated; non-admins see only their notes)
router.get("/notes", authenticate, getNotes);

// ✅ Get notes by subject (authenticated; scoped like list)
router.get("/notes/subject/:subject", authenticate, getNotesBySubject);

// ✅ Get single note by ID (authenticated; owner or admin)
router.get("/notes/:id", authenticate, getNoteById);

// ✅ Edit a note (Any authenticated user can edit their own notes)
router.put("/notes/:id", authenticate, editNote);

// ✅ Delete a note (Any authenticated user can delete their own notes)
router.delete("/notes/:id", authenticate, deleteNote);

// 🔧 Admin-only routes (if you want separate admin functionality)
// router.get("/admin/notes", authenticate, authorizeAdmin, getAllNotesAdmin);
// router.delete("/admin/notes/:id", authenticate, authorizeAdmin, forceDeleteNote);

module.exports = router;