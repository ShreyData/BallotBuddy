"use client";
import { useTimeline } from "../../hooks/useTimeline";
import { Timeline } from "../../components/Timeline";
import { Loader } from "../../components/Loader";

export default function TimelinePage() {
  const { timeline, isLoading, error } = useTimeline();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Election Timeline</h1>
        <p className="text-gray-600">Key phases of the democratic process.</p>
      </div>
      
      {isLoading && <Loader />}
      
      {error && (
        <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg" role="alert">
          {error}
        </div>
      )}
      
      {!isLoading && !error && <Timeline phases={timeline} />}
    </div>
  );
}
