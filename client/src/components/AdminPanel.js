import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/apiBase";
import PageLayout from "./layout/PageLayout";

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
      const response = await fetch(apiUrl("/api/users"), {
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

      const response = await fetch(apiUrl(`/api/promote/${userId}`), {
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

  const deleteUser = async (userId, username) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${username}"?`);
    if (!confirmDelete) return;

    setDeletingUserId(userId);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(apiUrl(`/api/users/${userId}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  if (loading) {
    return (
      <PageLayout title="Administration" subtitle="Loading directory…">
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 rounded-full border-2 border-nh-border border-t-nh-accent animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      eyebrow="Console"
      title="Admin panel"
      subtitle="Review accounts, promote trusted administrators, and remove access when required."
    >
      <div className="overflow-hidden rounded-nh-lg border border-nh-border bg-nh-surface shadow-nh-soft">
        <div className="border-b border-nh-border bg-nh-surface-2/50 px-5 py-4">
          <p className="text-sm text-nh-muted">
            {users.length} user{users.length === 1 ? "" : "s"} in directory
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nh-border text-xs font-semibold uppercase tracking-wider text-nh-muted">
                <th className="whitespace-nowrap px-5 py-3">Username</th>
                <th className="min-w-[12rem] px-5 py-3">Email</th>
                <th className="whitespace-nowrap px-5 py-3">Role</th>
                <th className="whitespace-nowrap px-5 py-3">Promote</th>
                <th className="whitespace-nowrap px-5 py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-nh-border/80 transition hover:bg-nh-accent-soft/25">
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-nh-text">{user.username}</td>
                  <td className="px-5 py-3.5 text-nh-muted break-all">{user.email}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 capitalize text-nh-text">{user.role}</td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    {user.role !== "admin" ? (
                      <button
                        type="button"
                        onClick={() => changeRole(user._id)}
                        className="rounded-nh-sm border border-nh-success/35 bg-nh-success/10 px-3 py-1.5 text-xs font-semibold text-nh-success transition hover:bg-nh-success/20"
                      >
                        Promote
                      </button>
                    ) : (
                      <span className="text-xs italic text-nh-muted">Admin</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => deleteUser(user._id, user.username)}
                      className="rounded-nh-sm border border-nh-danger/35 bg-nh-danger/10 px-3 py-1.5 text-xs font-semibold text-nh-danger transition hover:bg-nh-danger/18 disabled:opacity-50"
                      disabled={deletingUserId === user._id}
                    >
                      {deletingUserId === user._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
