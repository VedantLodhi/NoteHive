// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import '../css/AdminPanel.css';  

// const AdminPanel = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingUserId, setDeletingUserId] = useState(null); // Track which user is being deleted

//   useEffect(() => {
//     const userRole = localStorage.getItem("role");
//     const token = localStorage.getItem("token");

//     if (!userRole || userRole !== "admin" || !token) {
//       navigate("/login");
//       return;
//     }

//     fetchUsers(token);
//   }, [navigate]);

//   // Fetch users
//   const fetchUsers = async (token) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error("Failed to fetch users");

//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error("🚨 Error fetching users:", error.message);
//       alert("Failed to load users. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Change user role to admin
//   const changeRole = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`http://localhost:5000/api/promote/${userId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ role: "admin" }),
//       });

//       if (!response.ok) throw new Error("Failed to update role");

//       fetchUsers(token); // Refresh user list after role change
//       alert("User promoted to admin successfully.");
//     } catch (error) {
//       console.error("Failed to update role:", error.message);
//       alert(`Failed to promote user: ${error.message}`);
//     }
//   };

//   // Delete a user
//   const deleteUser = async (userId, username, email) => {
//     // Add confirmation prompt
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete user "${username}"? This action cannot be undone.`
//     );
//     if (!confirmDelete) return;

//     setDeletingUserId(userId); // Set the user being deleted to show a loading state
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.error("❌ No token found. User might not be logged in.");
//         alert("Session expired. Please log in again.");
//         navigate("/login");
//         return;
//       }

//       console.log(`🔹 Sending DELETE request for user ID: ${userId}`);
//       const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }), // Include email in the request body
//       });

//       const data = await response.json();
//       console.log("🔹 API Response:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to delete user");
//       }

//       console.log("✅ User deleted successfully.");
//       alert(`User "${username}" deleted successfully.`);

//       // Refresh user list after deletion
//       await fetchUsers(token);
//     } catch (error) {
//       console.error("❌ Failed to delete user:", error.message);
//       alert(`Failed to delete user: ${error.message}`);
//     } finally {
//       setDeletingUserId(null); // Reset the deleting state
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>Admin Panel</h2>

//       {/* User Management */}
//       <h3>User Management</h3>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user._id}>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>
//                 {user.role !== "admin" && (
//                   <button onClick={() => changeRole(user._id)}>Promote to Admin</button>
//                 )}
//                 <button
//                   onClick={() => deleteUser(user._id, user.username, user.email)} // Pass email and username
//                   style={{ marginLeft: "10px" }}
//                   disabled={deletingUserId === user._id}
//                 >
//                   {deletingUserId === user._id ? "Deleting..." : "Delete"}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPanel;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!userRole || userRole !== "admin" || !token) {
      navigate("/login");
      return;
    }

    fetchUsers(token);
  }, [navigate]);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/promote/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "admin" }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      fetchUsers(token);
      alert("User promoted to admin successfully.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const deleteUser = async (userId, username, email) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${username}"?`);
    if (!confirmDelete) return;

    setDeletingUserId(userId);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");

      alert(`User "${username}" deleted.`);
      fetchUsers(token);
    } catch (error) {
      alert(`Delete failed: ${error.message}`);
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Panel</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Promote</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 capitalize">{user.role}</td>

                {/* Promote Button */}
                <td className="py-3 px-4">
                  {user.role !== "admin" ? (
                    <button
                      onClick={() => changeRole(user._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Promote
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">Already Admin</span>
                  )}
                </td>

                {/* Delete Button */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => deleteUser(user._id, user.username, user.email)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    disabled={deletingUserId === user._id}
                  >
                    {deletingUserId === user._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
