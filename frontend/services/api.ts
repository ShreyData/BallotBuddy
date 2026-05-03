import {
  AIQueryResponse,
  ElectionGuideResponse,
  TimelineResponse,
  MisinformationResponse,
} from "../types/api";

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // Server-side (SSR) inside Docker
    return process.env.INTERNAL_API_URL || "http://backend:8000/api/v1";
  }
  // Client-side in browser
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
};

const API_BASE_URL = getBaseUrl();
// Helper to get the auth token (legacy support, moving to cookies)
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bb_auth_token");
};

async function fetchWithHandleError(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Support legacy Bearer token for now, but prioritize browser-managed cookies
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Enable cookie support
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const apiService = {
  login: async (id_token: string): Promise<any> => {
    return fetchWithHandleError(`${API_BASE_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify({ id_token }),
    });
  },

  logout: async (): Promise<any> => {
    return fetchWithHandleError(`${API_BASE_URL}/users/logout`, {
      method: "POST",
    });
  },

  askAI: async (question: string): Promise<AIQueryResponse> => {
    return fetchWithHandleError(`${API_BASE_URL}/ai/query`, {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  },

  getElectionGuide: async (role: string): Promise<ElectionGuideResponse> => {
    return fetchWithHandleError(`${API_BASE_URL}/elections/guide?role=${encodeURIComponent(role)}`);
  },

  getTimeline: async (): Promise<TimelineResponse> => {
    return fetchWithHandleError(`${API_BASE_URL}/timeline/`);
  },

  checkMisinformation: async (claim: string): Promise<MisinformationResponse> => {
    return fetchWithHandleError(`${API_BASE_URL}/ai/check-claim`, {
      method: "POST",
      body: JSON.stringify({ claim }),
    });
  },

  analyzeVoterSlip: async (file: File): Promise<{ analysis: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_BASE_URL}/ai/analyze-voter-slip`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
