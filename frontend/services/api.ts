import {
  AIQueryResponse,
  ElectionGuideResponse,
  TimelineResponse,
  MisinformationResponse,
} from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper to get the auth token (placeholder logic)
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bb_auth_token");
};

async function fetchWithHandleError(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const apiService = {
  loginGuest: async (): Promise<{ access_token: string }> => {
    const response = await fetch(`${API_BASE_URL}/users/login/guest`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to login as guest");
    const data = await response.json();
    localStorage.setItem("bb_auth_token", data.access_token);
    return data;
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
};
