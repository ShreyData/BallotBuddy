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
        const response = await apiService.getTimeline();
        if (isMounted) setTimeline(response.events);
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load timeline.";
          setError(errorMessage);
        }
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
