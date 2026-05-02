import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { TimelinePhase } from "../types/api";

export function useTimeline() {
  const [timeline, setTimeline] = useState<TimelinePhase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTimeline = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ensure we have a token
        if (!localStorage.getItem("bb_auth_token")) {
          await apiService.loginGuest();
        }
        
        const response = await apiService.getTimeline();
        if (isMounted) setTimeline(response.events);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to load timeline.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTimeline();
    return () => {
      isMounted = false;
    };
  }, []);

  return { timeline, isLoading, error };
}
