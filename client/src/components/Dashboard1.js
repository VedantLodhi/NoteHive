

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
// import {
//   FaBars,
//   FaTimes,
//   FaMoon,
//   FaSun,
//   FaStickyNote,
//   FaInfoCircle,
//   FaPuzzlePiece,
//   FaUsersCog,
//   FaSignOutAlt,
//   FaHome,
// } from "react-icons/fa";

// const Dashboard1 = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
//   const [username, setUsername] = useState(localStorage.getItem("username") || "");
//   const [role, setRole] = useState("");
//   const [profilePic, setProfilePic] = useState(
//     localStorage.getItem("profilePic") || "https://via.placeholder.com/150"
//   );
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role")?.trim().toLowerCase();
//     setRole(storedRole || "");
//   }, []);

//   useEffect(() => {
//     document.body.classList.toggle("dark", darkMode);
//     localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   const toggleMenu = () => setMenuOpen(!menuOpen);
//   const toggleDarkMode = () => setDarkMode((prev) => !prev);

//   const handleLogout = () => {
//     localStorage.clear();
//     setUsername("");
//     setRole("");
//     setProfilePic("https://via.placeholder.com/150");
//     navigate("/login");
//     window.location.reload();
//   };

//   return (
//     <div className={`flex h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
//       {/* Sidebar */}
//       <aside
//         className={`w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col transition-transform duration-300 ease-in-out ${
//           menuOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 fixed md:static z-40`}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold text-purple-600">NoteHive</h1>
//           <button className="md:hidden" onClick={toggleMenu}>
//             <FaTimes size={20} />
//           </button>
//         </div>

//         <nav className="flex flex-col space-y-4">
//           <Link to="/" className="hover:text-purple-600 flex items-center gap-2">
//             <FaHome /> Home
//           </Link>
//           <Link to="about" className="hover:text-purple-600 flex items-center gap-2">
//             <FaInfoCircle /> About
//           </Link>
//           <Link to="notes" className="hover:text-purple-600 flex items-center gap-2">
//             <FaStickyNote /> Notes
//           </Link>
//           <Link to="cp-trivia" className="hover:text-purple-600 flex items-center gap-2">
//             <FaPuzzlePiece /> Trivia
//           </Link>

//           {role === "admin" && (
//             <>
//               <Link to="/admin" className="hover:text-purple-600 flex items-center gap-2">
//                 <FaUsersCog /> Admin Panel
//               </Link>
//               <Link to="/admin/noteManager" className="hover:text-purple-600 flex items-center gap-2">
//                 <FaStickyNote /> Note Manager
//               </Link>
//             </>
//           )}
//         </nav>

//         <div className="mt-auto pt-4 border-t border-gray-300 dark:border-gray-700">
//           {username ? (
//             <div className="flex items-center gap-3">
//               <img
//                 src={profilePic}
//                 alt="profile"
//                 className="w-10 h-10 rounded-full border-2 border-purple-500"
//               />
//               <div>
//                 <p className="font-semibold">{username}</p>
//                 <button
//                   onClick={handleLogout}
//                   className="text-sm text-red-500 hover:underline flex items-center gap-1"
//                 >
//                   <FaSignOutAlt /> Logout
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col space-y-2">
//               <Link to="login" className="text-purple-600 hover:underline">
//                 Login
//               </Link>
//               <Link to="register" className="text-purple-600 hover:underline">
//                 Sign Up
//               </Link>
//             </div>
//           )}

//           <button
//             onClick={toggleDarkMode}
//             className="mt-4 flex items-center gap-2 text-sm hover:text-purple-600 transition-colors"
//           >
//             {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light Mode" : "Dark Mode"}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto p-6 md:ml-64 transition-all">
//         <div className="md:hidden mb-4">
//           <button onClick={toggleMenu} className="text-xl text-purple-600">
//             <FaBars />
//           </button>
//         </div>

//         {/* Render either Outlet or Welcome Content */}
//         {location.pathname === "/dashboard" ? (
//           <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
//             <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 p-1 rounded-3xl shadow-2xl w-full max-w-5xl">
//               <div className="bg-white dark:bg-gray-800 dark:text-white rounded-3xl p-10 sm:p-12 text-center animate-fade-in">
//                 <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-6">
//                   Welcome to Your Dashboard 🚀
//                 </h2>
//                 <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl mb-10">
//                   Your central hub for managing notes and user information.
//                 </p>
//                 <img
//                   src="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=1000&q=80"
//                   alt="Dashboard"
//                   className="w-full object-cover max-h-[400px] rounded-2xl"
//                 />
//               </div>
//             </div>
//           </div>
//         ) : (
//           <Outlet />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard1;
import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
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
} from "react-icons/fa";

const Dashboard1 = () => {
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
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    setUsername("");
    setRole("");
    setProfilePic("https://via.placeholder.com/150");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-40`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-purple-600">NoteHive</h1>
          <button className="md:hidden" onClick={toggleMenu}>
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link to="/" className="hover:text-purple-600 flex items-center gap-2">
            <FaHome /> Home
          </Link>
          <Link to="about" className="hover:text-purple-600 flex items-center gap-2">
            <FaInfoCircle /> About
          </Link>
          <Link to="notes" className="hover:text-purple-600 flex items-center gap-2">
            <FaStickyNote /> Notes
          </Link>
          <Link to="cp-trivia" className="hover:text-purple-600 flex items-center gap-2">
            <FaPuzzlePiece /> Trivia
          </Link>

          {role === "admin" && (
            <>
              <Link to="/admin" className="hover:text-purple-600 flex items-center gap-2">
                <FaUsersCog /> Admin Panel
              </Link>
              <Link to="/admin/noteManager" className="hover:text-purple-600 flex items-center gap-2">
                <FaStickyNote /> Note Manager
              </Link>
            </>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-300 dark:border-gray-700">
          {username ? (
            <div className="flex items-center gap-3">
              <img
                src={profilePic}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="font-semibold">{username}</p>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:underline flex items-center gap-1"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="login" className="text-purple-600 hover:underline">
                Login
              </Link>
              <Link to="register" className="text-purple-600 hover:underline">
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={toggleDarkMode}
            className="mt-4 flex items-center gap-2 text-sm hover:text-purple-600 transition-colors"
          >
            {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:ml-64 transition-all">
        <div className="md:hidden mb-4">
          <button onClick={toggleMenu} className="text-xl text-purple-600">
            <FaBars />
          </button>
        </div>

        {/* Welcome Content */}
        {location.pathname === "/dashboard" ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 p-1 rounded-3xl shadow-2xl w-full max-w-5xl animate-fade-in-up">
              <div className="bg-white dark:bg-gray-800 dark:text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-8 h-8 bg-purple-300 rounded-full animate-float"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 2}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="relative space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                      Welcome to NoteHive 🐝
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                      Your organized space for notes, trivia, and productivity
                    </p>
                  </div>

                  <div className="relative bg-purple-50 dark:bg-gray-700 rounded-2xl p-8 shadow-inner">
                    <div className="absolute top-4 left-4 text-purple-400">
                      <FaQuoteLeft size={24} />
                    </div>
                    <blockquote className="text-2xl italic text-center text-gray-800 dark:text-gray-200">
                      "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
                    </blockquote>
                    <p className="mt-4 text-right text-gray-600 dark:text-gray-400">
                      – Paul J. Meyer
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {['Notes', 'Trivia', 'Organization', 'Productivity'].map((item) => (
                      <div
                        key={item}
                        className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                      >
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Dashboard1;

