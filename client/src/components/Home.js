import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-nh-accent-soft blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-nh-accent-soft blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:py-20 md:py-28">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-nh-muted">
          NoteHive
        </p>
        <h1 className="mt-4 text-center font-display text-4xl leading-tight text-nh-text sm:text-5xl md:text-6xl text-balance">
          Notes and quizzes, <span className="italic text-nh-muted">refined</span> for calm focus
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-nh-muted sm:text-xl">
          A minimal workspace to capture ideas, organize study material, and sharpen skills with AI-powered trivia.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link to="/notes" className="nh-btn nh-btn-primary px-8 py-3 text-base">
            Open notes
          </Link>
          <Link to="/cp-trivia" className="nh-btn nh-btn-outline px-8 py-3 text-base">
            Try trivia
          </Link>
          <Link to="/register" className="nh-btn nh-btn-outline px-6 py-3 text-base border-dashed">
            Join free
          </Link>
        </div>

        <div className="nh-divider mx-auto mt-14 max-w-md" />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="nh-card overflow-hidden rounded-nh-lg p-0 shadow-nh">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                // src="https://images.unsplash.com/photo-1517842645767-c167b670f360?w=1200&q=80"
                src="/images/Screenshot.png"
                alt="Editorial workspace with notebook and warm light"
                className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.03]"
              />
            </div>
            <div className="border-t border-nh-border p-6 sm:p-8">
              <h2 className="font-display text-2xl text-nh-text sm:text-3xl">Designed for readability</h2>
              <p className="mt-3 text-nh-muted leading-relaxed">
                Generous spacing, soft contrast, and typography that keeps long sessions comfortable on any screen.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="nh-card rounded-nh-lg p-6 sm:p-8">
              <h3 className="font-display text-xl text-nh-text sm:text-2xl">Capture and return</h3>
              <p className="mt-3 text-sm leading-relaxed text-nh-muted sm:text-base">
                Create structured notes with rich content, then revisit them from a clean library view tuned for quick scanning.
              </p>
              <Link
                to="/create-note"
                className="mt-5 inline-flex text-sm font-semibold text-nh-primary transition hover:text-nh-primary-deep"
              >
                Start writing →
              </Link>
            </div>
            <div className="nh-card rounded-nh-lg p-6 sm:p-8">
              <h3 className="font-display text-xl text-nh-text sm:text-2xl">Practice with intent</h3>
              <p className="mt-3 text-sm leading-relaxed text-nh-muted sm:text-base">
                Topic quizzes, a clear progress rhythm, and a leaderboard that celebrates consistency without visual noise.
              </p>
              <Link
                to="/cp-trivia"
                className="mt-5 inline-flex text-sm font-semibold text-nh-primary transition hover:text-nh-primary-deep"
              >
                Explore trivia →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
