import axios from "axios";
import { getApiOrigin } from "./config/apiBase";

const origin = getApiOrigin();
const API = axios.create({ baseURL: origin ? `${origin}/api` : "/api" });

// Attach token to requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export default API;
