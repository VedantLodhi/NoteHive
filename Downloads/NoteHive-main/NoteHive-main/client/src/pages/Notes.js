import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        // Check if user is logged in
        if (!token || !username) {
          setError("Please log in to view your notes.");
          setLoading(false);
          return;
        }

        console.log('Fetching notes with token:', token ? 'Token exists' : 'No token');

        const response = await axios.get("http://localhost:5000/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log('Notes fetched successfully:', response.data);
        setNotes(response.data);
        setError(""); // Clear any previous errors
        
      } catch (error) {
        console.error("Error fetching notes:", error);
        console.error("Error response:", error.response);
        
        // Better error handling
        if (error.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        } else if (error.response?.status === 403) {
          setError("You don't have permission to view notes.");
        } else if (error.response?.status === 404) {
          setError("Notes endpoint not found. Please check your server.");
        } else if (!error.response) {
          setError("Cannot connect to server. Please check if your backend is running on port 5000.");
        } else {
          setError(`Failed to fetch notes: ${error.response?.data?.message || error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page heading and "Add New Note" button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📚 My Notes</h2>
        <Link
          to="/create-note"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          + Add New Note
        </Link>
      </div>

      {/* Show error message if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
          {error.includes("log in") && (
            <div className="mt-2">
              <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">
                Go to Login Page
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Show message if no notes exist */}
      {!error && notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg mb-4">
            No notes available. Create your first note!
          </p>
          <Link
            to="/create-note"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all shadow-md inline-block"
          >
            Create Your First Note
          </Link>
        </div>
      ) : !error ? (
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
      ) : null}
    </div>
  );
};

export default Notes;