"use client";
import { useState } from "react";
import { apiService } from "../../services/api";
import { StepCard } from "../../components/StepCard";
import { Loader } from "../../components/Loader";

export default function GuidePage() {
  const [role, setRole] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    setIsLoading(true);
    setError(null);
    setSteps([]);

    try {
      const res = await apiService.getElectionGuide(role);
      setSteps(res.steps);
    } catch (err: any) {
      setError(err.message || "Failed to load guide.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Personalized Voting Guide</h1>
        <p className="text-gray-600">Enter your role (e.g., voter, student, first_time_voter) to get specific instructions.</p>
      </div>

      <form onSubmit={fetchGuide} className="flex gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm border">
        <label htmlFor="role-input" className="sr-only">Your Role</label>
        <input
          id="role-input"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. student"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading || !role.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Generating..." : "Get Guide"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6" role="alert">
          {error}
        </div>
      )}

      {steps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Your Checklist</h2>
          {steps.map((step, idx) => (
            <StepCard key={idx} stepNumber={idx + 1} content={step} />
          ))}
        </div>
      )}
    </div>
  );
}
