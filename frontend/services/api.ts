import {
  AIQueryResponse,
  ElectionGuideResponse,
  TimelineResponse,
  MisinformationResponse,
} from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchWithHandleError(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const apiService = {
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
