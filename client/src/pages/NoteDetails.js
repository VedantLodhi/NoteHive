import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import PageLayout from "../components/layout/PageLayout";

const NoteDetails = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await API.get(`notes/${id}`);
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
    return (
      <PageLayout>
        <p className="py-16 text-center text-nh-muted animate-pulse">Loading your note…</p>
      </PageLayout>
    );
  }

  if (!note) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return (
      <PageLayout title="Note unavailable">
        <div className="nh-card rounded-nh-lg px-6 py-10 text-center">
          <p className="text-nh-danger font-medium">
            {token ? "This note could not be found, or you do not have access." : "Please sign in to view this note."}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <article className="nh-glass-panel mx-auto max-w-3xl overflow-hidden rounded-nh-lg px-6 py-10 sm:px-10 sm:py-12">
        <header className="border-b border-nh-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nh-muted">Reading view</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-nh-text sm:text-4xl text-balance">{note.title}</h1>
          {note.subject && (
            <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-nh-accent">{note.subject}</p>
          )}
        </header>

        <div
          className="nh-prose-note mt-10 max-w-none [&_a]:text-nh-primary [&_img]:rounded-nh-sm [&_img]:shadow-nh-soft"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        <footer className="nh-divider mt-12 pt-8 text-right">
          <p className="text-sm italic text-nh-muted">Happy learning</p>
        </footer>
      </article>
    </PageLayout>
  );
};

export default NoteDetails;
