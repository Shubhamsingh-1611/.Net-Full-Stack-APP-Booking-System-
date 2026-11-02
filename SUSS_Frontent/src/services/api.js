import axios from "axios";

// Set VITE_API_BASE_URL in .env (e.g. https://localhost:7001). Falls back to same origin.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// The app registers a function that returns the current access token (see setTokenProvider).
let tokenProvider = null;

export function setTokenProvider(fn) {
  tokenProvider = fn;
}

// Attach "Authorization: Bearer <token>" to every request.
// If no provider is registered yet (no login), the request goes without a token.
api.interceptors.request.use(async (config) => {
  if (tokenProvider) {
    const token = await tokenProvider();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const DEFAULT_ERROR = "Unable to submit Form D1. Please try again.";
const DEFAULT_D1_CHECK_ERROR =
  "Unable to check whether Form D1 has been submitted. Please try again.";

/**
 * Turns an axios error into a normal Error with a readable message,
 * so the component can simply show error.message.
 */
function toError(error, fallbackMessage = DEFAULT_ERROR) {
  // No response: network down, server off, or timeout
  if (!error.response) {
    return new Error("Cannot reach the server. Please check your connection and try again.");
  }

  const { status, data } = error.response;

  // 400: ASP.NET validation errors -> { errors: { Field: ["msg", ...] } }
  if (status === 400 && data?.errors) {
    const messages = Object.values(data.errors).flat();
    return new Error(messages.join(" ") || fallbackMessage);
  }

  // 409 and others: backend sends { message: "..." }
  if (data?.message) return new Error(data.message);

  if (status === 401) return new Error("Your session has expired. Please log in again.");
  if (status === 403) return new Error("You do not have permission to do this.");

  return new Error(fallbackMessage);
}

/**
 * GET /api/FormD1/d1exist
 * @returns {Promise<boolean>} whether the signed-in client already submitted Form D1
 */
export async function checkD1Exists() {
  try {
    const { data } = await api.get("/api/FormD1/d1exist");
    if (typeof data !== "boolean") {
      throw new Error("The server returned an invalid Form D1 status.");
    }
    return data;
  } catch (error) {
    if (error instanceof Error && !axios.isAxiosError(error)) throw error;
    throw toError(error, DEFAULT_D1_CHECK_ERROR);
  }
}

/**
 * POST /api/FormD1/submit
 * @param {object} payload - the object built in FormD1's onSubmit
 * @returns {Promise<object>} response data from the backend
 */
export async function submitD1(payload) {
  try {
    const { data } = await api.post("/api/FormD1/submit", payload);
    return data;
  } catch (error) {
    throw toError(error);
  }
}

export default api;