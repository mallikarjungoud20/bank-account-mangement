// Use environment variable if available, otherwise default to localhost
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8080/api";

console.log("🌐 API Base URL:", BASE_URL);

export default BASE_URL;