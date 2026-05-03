"use client";
import { useState, useRef, useEffect } from "react";

export const dynamic = "force-dynamic";

import { apiService } from "../../services/api";
import { StepCard } from "../../components/StepCard";
import { Loader } from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";



export default function GuidePage() {
  const [role, setRole] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const fetchGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    if (!user) {
      setError("Please login with Google to access personalized guides.");
      return;
    }

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
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Personalized Voting Guide</h1>
        <p className="text-gray-600">Enter your role (e.g., student, senior_citizen) to get ECI-aligned instructions.</p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 text-center">
          <p className="text-amber-800 font-medium mb-4">You need to be logged in to generate personalized guides.</p>
          <button 
            onClick={signInWithGoogle}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Login with Google
          </button>
        </div>
      )}

      <form onSubmit={fetchGuide} className="flex gap-4 mb-10 bg-white/60 backdrop-blur-xl p-4 rounded-[24px] shadow-xl border border-white/20">
        <label htmlFor="role-input" className="sr-only">Your Role</label>
        <input
          id="role-input"
          ref={inputRef}
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. first time voter"
          className="flex-1 p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading || !role.trim()}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
        >
          {isLoading ? "Generating..." : "Get Guide"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-6" role="alert">
          {error}
        </div>
      )}

      {steps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Your Checklist</h2>
          {steps.map((step, idx) => (
            <StepCard key={idx} stepNumber={idx + 1} content={step} />
          ))}
        </div>
      )}
    </div>
  );
}
