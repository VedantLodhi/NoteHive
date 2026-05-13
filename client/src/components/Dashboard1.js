import React, { useState, useEffect } from "react";
import { Link, NavLink as RouterNavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaStickyNote,
  FaInfoCircle,
  FaPuzzlePiece,
  FaUsersCog,
  FaSignOutAlt,
  FaHome,
  FaQuoteLeft,
  FaUser,
  FaPenFancy,
} from "react-icons/fa";

const navLinkClass = ({ isActive }) =>
  [
    "group flex items-center gap-3 rounded-nh-sm px-3 py-2.5 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-nh-accent-soft text-nh-text shadow-nh-soft border border-nh-border"
      : "text-nh-muted hover:text-nh-text hover:bg-nh-surface-2/80 border border-transparent",
  ].join(" ");

const Dashboard1 = ({ username: appUsername } = {}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState("");
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || "https://via.placeholder.com/150"
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role")?.trim().toLowerCase();
    setRole(storedRole || "");
  }, []);

  useEffect(() => {
    if (appUsername) setUsername(appUsername);
  }, [appUsername]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen((o) => !o);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    setUsername("");
    setRole("");
    setProfilePic("https://via.placeholder.com/150");
    navigate("/login");
    window.location.reload();
  };

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <div
      className={`flex min-h-screen font-sans text-nh-text bg-nh-bg transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-stone-900/25 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={[
          "z-40 flex w-[min(18rem,88vw)] shrink-0 flex-col border-r border-nh-border bg-nh-surface/95 px-4 py-6 backdrop-blur-md transition-transform duration-300 ease-out md:static md:translate-x-0",
          menuOpen ? "fixed inset-y-0 left-0 translate-x-0 shadow-nh" : "fixed -translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="mb-8 flex items-center justify-between gap-2">
          <Link
            to="/"
            className="font-display text-2xl tracking-tight text-nh-text transition-opacity hover:opacity-80"
            onClick={closeMobileMenu}
          >
            NoteHive
          </Link>
          <button
            type="button"
            className="rounded-nh-sm p-2 text-nh-muted transition-colors hover:bg-nh-accent-soft hover:text-nh-text md:hidden"
            onClick={closeMobileMenu}
            aria-label="Close navigation"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-nh-muted">Menu</p>
        <nav className="flex flex-col gap-1" onClick={closeMobileMenu}>
          <RouterNavLink to="/" end className={({ isActive }) => navLinkClass({ isActive })}>
            <FaHome className="opacity-70 group-hover:opacity-100" aria-hidden />
            Home
          </RouterNavLink>
          <RouterNavLink to="about" className={({ isActive }) => navLinkClass({ isActive })}>
            <FaInfoCircle className="opacity-70 group-hover:opacity-100" aria-hidden />
            About
          </RouterNavLink>
          <RouterNavLink to="notes" className={({ isActive }) => navLinkClass({ isActive })}>
            <FaStickyNote className="opacity-70 group-hover:opacity-100" aria-hidden />
            Notes
          </RouterNavLink>
          <RouterNavLink to="cp-trivia" className={({ isActive }) => navLinkClass({ isActive })}>
            <FaPuzzlePiece className="opacity-70 group-hover:opacity-100" aria-hidden />
            Trivia &amp; Quiz
          </RouterNavLink>
          {username && (
            <RouterNavLink to="/profile" className={({ isActive }) => navLinkClass({ isActive })}>
              <FaUser className="opacity-70 group-hover:opacity-100" aria-hidden />
              Profile
            </RouterNavLink>
          )}
          {username && (
            <RouterNavLink to="create-note" className={({ isActive }) => navLinkClass({ isActive })}>
              <FaPenFancy className="opacity-70 group-hover:opacity-100" aria-hidden />
              Create note
            </RouterNavLink>
          )}
          {role === "admin" && (
            <>
              <RouterNavLink to="/admin" className={({ isActive }) => navLinkClass({ isActive })}>
                <FaUsersCog className="opacity-70 group-hover:opacity-100" aria-hidden />
                Admin
              </RouterNavLink>
              <RouterNavLink to="/admin/noteManager" className={({ isActive }) => navLinkClass({ isActive })}>
                <FaStickyNote className="opacity-70 group-hover:opacity-100" aria-hidden />
                Note manager
              </RouterNavLink>
            </>
          )}
        </nav>

        <div className="nh-divider my-6" />

        <div className="mt-auto space-y-4">
          {username ? (
            <div className="nh-card rounded-nh-sm p-3">
              <div className="flex items-center gap-3">
                <img
                  src={profilePic}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-full border border-nh-border-strong object-cover"
                />
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold text-nh-text">{username}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-nh-danger transition hover:underline"
                  >
                    <FaSignOutAlt className="shrink-0" aria-hidden />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="nh-btn nh-btn-primary w-full justify-center text-sm"
                onClick={closeMobileMenu}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="nh-btn nh-btn-outline w-full justify-center text-sm"
                onClick={closeMobileMenu}
              >
                Create account
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex w-full items-center justify-center gap-2 rounded-nh-sm border border-nh-border bg-nh-surface-2/50 py-2.5 text-sm text-nh-muted transition hover:border-nh-accent hover:text-nh-text"
          >
            {darkMode ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
            {darkMode ? "Light appearance" : "Dark appearance"}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-nh-border bg-nh-surface/80 px-4 py-3 backdrop-blur-md md:hidden">
          <button
            type="button"
            className="rounded-nh-sm p-2 text-nh-text transition hover:bg-nh-accent-soft"
            onClick={toggleMenu}
            aria-label="Open navigation"
          >
            <FaBars size={20} />
          </button>
          <span className="font-display text-lg text-nh-text">NoteHive</span>
          <span className="w-10" aria-hidden />
        </header>

        <main className="flex-1 overflow-y-auto">
          {location.pathname === "/dashboard" ? (
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 md:py-24">
              <div className="nh-glass-panel relative max-w-3xl overflow-hidden p-8 sm:p-12 md:p-14">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-nh-accent-soft blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-nh-accent-soft blur-3xl opacity-80"
                  aria-hidden
                />

                <div className="relative space-y-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-nh-muted">Dashboard</p>
                  <h2 className="font-display text-4xl text-nh-text sm:text-5xl">Welcome to NoteHive</h2>
                  <p className="mx-auto max-w-lg text-lg leading-relaxed text-nh-muted">
                    Your quiet space for notes, practice quizzes, and focused study.
                  </p>

                  <div className="relative rounded-nh border border-nh-border bg-nh-surface-2/40 p-8 text-left shadow-nh-soft">
                    <FaQuoteLeft className="mb-4 text-nh-accent opacity-60" aria-hidden />
                    <blockquote className="font-display text-xl italic leading-snug text-nh-text sm:text-2xl">
                      Productivity is never an accident. It is always the result of a commitment to excellence,
                      intelligent planning, and focused effort.
                    </blockquote>
                    <p className="mt-4 text-right text-sm text-nh-muted">— Paul J. Meyer</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["Notes", "Trivia", "Clarity", "Focus"].map((item) => (
                      <div
                        key={item}
                        className="rounded-nh-sm border border-nh-border bg-nh-surface-2/30 px-3 py-4 text-center text-sm font-semibold text-nh-text shadow-nh-soft transition hover:border-nh-accent hover:shadow-nh"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard1;
