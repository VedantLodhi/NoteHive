import axios from "axios";
import { apiUrl } from "../config/apiBase";

const authBase = () => apiUrl("/api/auth");

export const registerUser = async (formData) => {
  const response = await fetch(`${authBase()}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to register user");
  }

  return response.json();
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${authBase()}/login`, userData);
  return response.data;
};
