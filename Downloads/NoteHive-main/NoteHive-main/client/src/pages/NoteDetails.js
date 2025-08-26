import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NoteDetails = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notes/${id}`);
        if (res.data && res.data.note) {
          setNote(res.data.note);
        }
      } catch (error) {
        console.error("Error fetching note:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg mt-10 font-medium text-blue-600 animate-pulse">Loading your study note...</div>;
  }

  if (!note) {
    return <div className="text-center mt-10 text-red-500 text-lg font-semibold">🚫 Note not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-12 bg-white shadow-xl rounded-2xl">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">{note.title}</h2>
        <p className="text-lg text-indigo-600 mt-2 font-medium">{note.subject}</p>
      </div>

      <div
        className="prose lg:prose-xl max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:marker:text-indigo-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: note.content }}
      ></div>

      <div className="mt-10 text-right">
        <p className="text-sm text-gray-500 italic">Happy Learning 📘</p>
      </div>
    </div>
  );
};

export default NoteDetails;
