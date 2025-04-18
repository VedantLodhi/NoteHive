
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Role check

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        setIsAdmin(role === "admin"); // ✅ Check if admin
        const response = await axios.get("http://localhost:5000/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium text-gray-600">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page heading and "Add New Note" button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📚 My Notes</h2>
        {isAdmin && (
          <Link
            to="/admin/noteManager"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
          >
            + Add New Note
          </Link>
        )}
      </div>

      {/* Show message if no notes exist */}
      {notes.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No notes available. Create your first note!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loop through each note */}
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 group"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{note.subject}</p>
              </div>
              <div className="px-6 pb-4">
                {/* Link to note details page using the note's ID */}
                <Link
                  to={`/notes/${note._id}`}
                  className="inline-block mt-2 text-blue-500 hover:text-blue-700 font-medium"
                >
                  View Note →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
