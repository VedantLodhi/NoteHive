import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import PageLayout from "../components/layout/PageLayout";

const NoteManager = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState({ title: "", subject: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please log in to access notes.");
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await API.get("notes");
        setNotes(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching notes:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("You don't have permission to access notes.");
        } else if (!err.response) {
          setError("Cannot reach the API. Ensure the server is running.");
        } else {
          setError(err.response?.data?.message || "Failed to fetch notes. Please try again.");
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
        const response = await API.put(`notes/${editingNoteId}`, {
          ...note,
          content: cleanedContent,
        });
        const updatedNote = response.data.note;
        setNotes((prev) => prev.map((n) => (n._id === editingNoteId ? updatedNote : n)));
      } else {
        const response = await API.post("notes", {
          ...note,
          content: cleanedContent,
        });
        setNotes((prev) => [response.data.note, ...prev]);
      }

      setNote({ title: "", subject: "", content: "" });
      setEditingNoteId(null);
      setError("");
    } catch (err) {
      console.error("Error saving note:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to save notes.");
      } else {
        setError("Failed to save note. Please check all fields and try again.");
      }
    }
  };

  const editNote = (n) => {
    setEditingNoteId(n._id);
    setNote({
      title: n.title,
      subject: n.subject,
      content: n.content,
    });
    setError("");
  };

  const deleteNote = async (id) => {
    if (!token) {
      setError("Please log in to delete notes.");
      return;
    }

    try {
      await API.delete(`notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      setError("");
    } catch (err) {
      console.error("Error deleting note:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
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

  if (loading) {
    return (
      <PageLayout title="Note manager" subtitle="Loading your workspace…">
        <div className="flex justify-center py-16 text-nh-muted">
          <div className="h-10 w-10 rounded-full border-2 border-nh-border border-t-nh-accent animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      eyebrow="Studio"
      title="Note manager"
      subtitle="Compose with a calm editor surface, then curate everything in a structured list below."
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/notes")}
          className="text-sm font-medium text-nh-muted transition hover:text-nh-text"
        >
          ← Back to notes
        </button>
      </div>

      {error && (
        <div className="nh-card mb-8 border border-nh-danger/30 px-4 py-3 text-sm text-nh-danger" role="alert">
          {error}
        </div>
      )}

      <section className="nh-card mb-12 rounded-nh-lg p-6 sm:p-8">
        <h2 className="font-display text-2xl text-nh-text">{editingNoteId ? "Edit note" : "Create note"}</h2>
        <p className="mt-2 text-sm text-nh-muted">Title, subject, and body are required before saving.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="note-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-nh-muted">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              placeholder="A clear, memorable title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="nh-input"
            />
          </div>
          <div>
            <label
              htmlFor="note-subject"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-nh-muted"
            >
              Subject
            </label>
            <input
              id="note-subject"
              type="text"
              placeholder="Course, project, or theme"
              value={note.subject}
              onChange={(e) => setNote({ ...note, subject: e.target.value })}
              className="nh-input"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-nh-muted">Content</span>
            <div className="overflow-hidden rounded-nh-sm border border-nh-border bg-nh-surface-2">
              <Editor
                apiKey="qks55it6scopg5ibx5k982jzxunxu1x79rdlzkmx2yapv5bb"
                value={note.content}
                onEditorChange={(content) => setNote({ ...note, content })}
                init={{
                  height: 280,
                  menubar: false,
                  plugins: "lists link image table code",
                  toolbar: "undo redo | bold italic underline | bullist numlist | link | code",
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={saveNote} className="nh-btn nh-btn-primary px-6">
            {editingNoteId ? "Update note" : "Save note"}
          </button>
          {editingNoteId && (
            <button type="button" onClick={clearForm} className="nh-btn nh-btn-outline px-6">
              Cancel edit
            </button>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl text-nh-text">All notes</h2>
          <span className="text-sm text-nh-muted">{notes.length} total</span>
        </div>

        {notes.length === 0 ? (
          <div className="nh-card rounded-nh-lg px-6 py-12 text-center text-nh-muted">No notes yet. Use the form above to add your first entry.</div>
        ) : (
          <div className="overflow-x-auto rounded-nh-lg border border-nh-border bg-nh-surface shadow-nh-soft">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-nh-border bg-nh-surface-2/80">
                  <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-nh-muted">
                    Title
                  </th>
                  <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-nh-muted">
                    Subject
                  </th>
                  <th className="min-w-[12rem] px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-nh-muted">
                    Preview
                  </th>
                  <th className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-nh-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {notes.map((row) => (
                  <tr key={row._id} className="border-b border-nh-border/80 transition hover:bg-nh-accent-soft/30">
                    <td className="px-5 py-4 font-medium text-nh-text">{row.title}</td>
                    <td className="px-5 py-4 text-nh-muted">{row.subject}</td>
                    <td className="max-w-xs px-5 py-4 text-nh-muted">
                      <div
                        className="line-clamp-2 break-words"
                        dangerouslySetInnerHTML={{
                          __html:
                            row.content.split(" ").slice(0, 14).join(" ") +
                            (row.content.split(" ").length > 14 ? "…" : ""),
                        }}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => editNote(row)}
                          className="rounded-nh-sm border border-nh-border-strong bg-nh-surface-2 px-3 py-1.5 text-xs font-semibold text-nh-text transition hover:border-nh-accent"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Delete this note permanently?")) deleteNote(row._id);
                          }}
                          className="rounded-nh-sm border border-nh-danger/40 px-3 py-1.5 text-xs font-semibold text-nh-danger transition hover:bg-nh-danger/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default NoteManager;
