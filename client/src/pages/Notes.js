import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import PageLayout from "../components/layout/PageLayout";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [extractedText, setExtractedText] = useState("");

  const handleDownload = (
    url,
    fileName
  ) => {

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      fileName || "file";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadError("");
    setUploadResult("");
    setExtractedText("");

    try {
      const response = await API.post("/upload-note", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const text =
        response.data?.fullText ||
        response.data?.preview;

      if (text) {
        setExtractedText(text);

        const newNote = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          content: text,
          subject: "Uploaded Notes",
          fileUrl: response.data.fileUrl,
          originalFileName: response.data.fileName,
          isUploadedFile: true,
        };

        // Save in Mongo
        await API.post(
          "/notes",
          newNote
        );

        // Refresh notes
        const notesResponse =
          await API.get("/notes");

        setNotes(
          notesResponse.data
        );

        setUploadResult(
          "File uploaded & saved successfully "
        );
      }

    } catch (err) {

      console.error(
        "Error uploading file:",
        err
      );

      setUploadError(
        err.response?.data?.message ||
        err.message ||
        "Failed to upload file."
      );

    } finally {

      setUploading(false);
      event.target.value = null;
    }
  };

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

        const response = await API.get("/notes");
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
        <div className="flex flex-wrap items-center gap-3">
          <label
            className={`nh-btn shrink-0 cursor-pointer justify-center rounded-nh border border-nh-border bg-nh-surface-2 px-6 py-2.5 text-sm font-semibold text-nh-text transition hover:bg-nh-border sm:inline-flex ${uploading ? "pointer-events-none opacity-50" : ""
              }`}
          >
            {uploading ? "Uploading..." : "Upload Notes"}
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <Link
            to="/create-note"
            className="nh-btn nh-btn-primary shrink-0 justify-center px-6 py-2.5 text-sm sm:inline-flex"
          >
            New note
          </Link>
        </div>
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

      {uploadError && (
        <div
          className="nh-card mb-8 border border-nh-danger/25 bg-nh-surface-2/80 px-5 py-4 text-sm text-nh-text"
          role="alert"
        >
          <p className="font-medium text-nh-danger">{uploadError}</p>
        </div>
      )}

      {uploadResult && (
        <div
          className="nh-card mb-8 border border-green-500/25 bg-green-500/10 px-5 py-4 text-sm text-green-500"
          role="alert"
        >
          <p className="font-medium">{uploadResult}</p>
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
              className="group nh-card flex flex-col overflow-hidden rounded-nh-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-nh relative"
            >
              {note.isUploadedFile && (
                <div className="absolute right-4 top-4 rounded bg-nh-surface-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-nh-muted border border-nh-border shadow-sm flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  Uploaded
                </div>
              )}
              <div className="border-b border-nh-border px-6 pb-4 pt-6">
                <h3 className="font-display text-xl leading-snug text-nh-text transition group-hover:text-nh-primary pr-20">
                  {note.title}
                </h3>
                {note.subject && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-nh-muted">{note.subject}</p>
                )}
                {note.isUploadedFile && (
                  <p className="mt-1 text-[11px] text-nh-muted">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="mt-auto flex items-center justify-between px-6 pb-6 pt-4">
                <Link
                  to={`/notes/${note._id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-nh-primary transition hover:gap-3"
                >
                  View note
                  <span aria-hidden>→</span>


                </Link>
                {note.isUploadedFile && note.fileUrl && (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          window.open(
                            note.fileUrl,
                            "_blank"
                          )
                        }
                        className="inline-flex items-center justify-center rounded-full bg-nh-surface-2 p-2 text-nh-primary transition hover:bg-nh-primary hover:text-white"
                        title="View original file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(
                            note.fileUrl,
                            note.originalFileName
                          )
                        }
                        className="inline-flex items-center justify-center rounded-full bg-nh-surface-2 p-2 text-nh-primary transition hover:bg-nh-primary hover:text-white"
                        title="Download original file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {extractedText && (
        <div className="mt-12 rounded-nh-lg border border-nh-border bg-nh-surface-2 p-6 shadow-nh">
          <h3 className="mb-4 font-display text-xl text-nh-text">Extracted Text Preview</h3>
          <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded bg-nh-surface p-5 text-sm leading-relaxed text-nh-text shadow-inner">
            {extractedText}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Notes;
