import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import PageLayout from "../components/layout/PageLayout";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        if (!token || !username) {
          setError("Please log in to view your notes.");
          setLoading(false);
          return;
        }

        const response = await API.get("notes");
        setNotes(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching notes:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        } else if (err.response?.status === 403) {
          setError("You don't have permission to view notes.");
        } else if (err.response?.status === 404) {
          setError("Notes endpoint not found. Please check your server.");
        } else if (!err.response) {
          setError(
            "Cannot reach the API. Ensure the server is running and server/.env has a valid MONGO_URI."
          );
        } else {
          setError(`Failed to fetch notes: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-nh-muted">
          <div
            className="h-12 w-12 rounded-full border-2 border-nh-border border-t-nh-accent animate-spin"
            aria-hidden
          />
          <p className="text-sm font-medium">Loading your library…</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      eyebrow="Library"
      title="My notes"
      subtitle="Browse your collection. Each card opens the full note with comfortable reading typography."
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-nh-muted">
          {notes.length > 0 ? `${notes.length} note${notes.length === 1 ? "" : "s"}` : ""}
        </p>
        <Link
          to="/create-note"
          className="nh-btn nh-btn-primary shrink-0 justify-center px-6 py-2.5 text-sm sm:inline-flex"
        >
          New note
        </Link>
      </div>

      {error && (
        <div
          className="nh-card mb-8 border border-nh-danger/25 bg-nh-surface-2/80 px-5 py-4 text-sm text-nh-text"
          role="alert"
        >
          <p className="font-medium text-nh-danger">{error}</p>
          {error.includes("log in") && (
            <p className="mt-3">
              <Link to="/login" className="font-semibold text-nh-primary underline-offset-4 hover:underline">
                Go to sign in
              </Link>
            </p>
          )}
        </div>
      )}

      {!error && notes.length === 0 ? (
        <div className="nh-glass-panel flex flex-col items-center px-6 py-16 text-center sm:py-20">
          <p className="font-display text-2xl text-nh-text">Your shelf is ready</p>
          <p className="mt-3 max-w-md text-nh-muted">Create a first note to see it appear here as a refined card.</p>
          <Link to="/create-note" className="nh-btn nh-btn-primary mt-8 px-8">
            Create a note
          </Link>
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note._id}
              className="group nh-card flex flex-col overflow-hidden rounded-nh-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-nh"
            >
              <div className="border-b border-nh-border px-6 pb-4 pt-6">
                <h3 className="font-display text-xl leading-snug text-nh-text transition group-hover:text-nh-primary">
                  {note.title}
                </h3>
                {note.subject && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-nh-muted">{note.subject}</p>
                )}
              </div>
              <div className="mt-auto px-6 pb-6 pt-4">
                <Link
                  to={`/notes/${note._id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-nh-primary transition hover:gap-3"
                >
                  View note
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </PageLayout>
  );
};

export default Notes;
