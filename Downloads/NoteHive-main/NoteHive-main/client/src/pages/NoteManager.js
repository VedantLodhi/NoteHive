import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NoteManager = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState({ title: "", subject: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      setError("Please log in to access notes.");
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching notes:", error);
        
        // Better error handling based on response status
        if (error.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          // Optionally redirect to login
          // navigate('/login');
        } else if (error.response?.status === 403) {
          setError("You don't have permission to access notes.");
        } else {
          setError("Failed to fetch notes. Please check your connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  const saveNote = async () => {
    if (!token) {
      setError("Please log in to save notes.");
      return;
    }

    if (!note.title.trim() || !note.subject.trim() || !note.content.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const cleanedContent = note.content.replace(/^<p>/, "").replace(/<\/p>$/, "");

    try {
      if (editingNoteId) {
        const response = await axios.put(
          `http://localhost:5000/api/notes/${editingNoteId}`,
          { ...note, content: cleanedContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedNote = response.data.note;
        const updatedNotes = notes.map((n) => (n._id === editingNoteId ? updatedNote : n));
        setNotes(updatedNotes);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/notes",
          { ...note, content: cleanedContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotes([response.data.note, ...notes]);
      }

      setNote({ title: "", subject: "", content: "" });
      setEditingNoteId(null);
      setError(""); // Clear any errors on success
    } catch (error) {
      console.error("Error saving note:", error);
      
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to save notes.");
      } else {
        setError("Failed to save note. Please check all fields are filled and try again.");
      }
    }
  };

  const editNote = (note) => {
    setEditingNoteId(note._id);
    setNote({
      title: note.title,
      subject: note.subject,
      content: note.content,
    });
    setError(""); // Clear errors when starting to edit
  };

  const deleteNote = async (id) => {
    if (!token) {
      setError("Please log in to delete notes.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
      setError(""); // Clear errors on success
    } catch (error) {
      console.error("Error deleting note:", error);
      
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to delete this note.");
      } else {
        setError("Failed to delete note. Please try again.");
      }
    }
  };

  const clearForm = () => {
    setNote({ title: "", subject: "", content: "" });
    setEditingNoteId(null);
    setError("");
  };

  if (loading) return <p className="text-center text-lg py-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Note Manager</h2>
        <button
          onClick={() => navigate('/notes')}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Back to Notes
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Note Creation/Editing Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {editingNoteId ? "Edit Note" : "Create New Note"}
        </h3>
        
        <input
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Subject"
          value={note.subject}
          onChange={(e) => setNote({ ...note, subject: e.target.value })}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Editor
          apiKey="qks55it6scopg5ibx5k982jzxunxu1x79rdlzkmx2yapv5bb"
          value={note.content}
          onEditorChange={(content) => setNote({ ...note, content })}
          init={{
            height: 250,
            menubar: false,
            plugins: "lists link image table code",
            toolbar: "undo redo | bold italic underline | bullist numlist | link | code",
          }}
        />
        <div className="mt-4 flex gap-3">
          <button
            onClick={saveNote}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            {editingNoteId ? "Update Note" : "Add Note"}
          </button>
          {editingNoteId && (
            <button
              onClick={clearForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Notes List */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">All Notes ({notes.length})</h3>
      
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No notes found.</p>
          <p>Create your first note using the form above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Subject</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Content</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800 font-medium">{note.title}</td>
                  <td className="px-6 py-4 text-gray-700">{note.subject}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs">
                    <div
                      className="truncate"
                      dangerouslySetInnerHTML={{
                        __html: note.content.split(" ").slice(0, 10).join(" ") + 
                                (note.content.split(" ").length > 10 ? "..." : ""),
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => editNote(note)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm('Are you sure you want to delete this note?')) {
                          deleteNote(note._id);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NoteManager;