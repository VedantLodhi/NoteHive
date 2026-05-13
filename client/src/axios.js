import axios from "axios";
import { getApiOrigin } from "./config/apiBase";

const origin = getApiOrigin();
export const axiosInstance = axios.create({
  baseURL: origin ? `${origin}/api` : "/api",
});
