
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        alert("Failed to fetch notes. Make sure you are an admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  const saveNote = async () => {
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
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Make sure all fields are filled and you're authorized.");
    }
  };

  const editNote = (note) => {
    setEditingNoteId(note._id);
    setNote({
      title: note.title,
      subject: note.subject,
      content: note.content,
    });
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note. Are you an admin?");
    }
  };

  if (loading) return <p className="text-center text-lg py-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Note Manager</h2>

      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <input
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Subject"
          value={note.subject}
          onChange={(e) => setNote({ ...note, subject: e.target.value })}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <button
          onClick={saveNote}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
        >
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">All Notes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
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
              <tr key={note._id} className="border-t">
                <td className="px-6 py-4 text-gray-800 font-medium">{note.title}</td>
                <td className="px-6 py-4 text-gray-700">{note.subject}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        note.content.split(" ").slice(0, 10).join(" ") + "...",
                    }}
                  />
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => editNote(note)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoteManager;