"use client";
import { useState, useRef, useEffect } from "react";
import { apiService } from "../../services/api";
import { MisinformationResponse } from "../../types/api";
import { Loader } from "../../components/Loader";

export default function MisinformationPage() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<MisinformationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const checkClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Ensure we have a token
      if (!localStorage.getItem("bb_auth_token")) {
        await apiService.loginGuest();
      }
      
      const res = await apiService.checkMisinformation(claim);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to verify claim.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Fact Checker</h1>
        <p className="text-gray-600">Paste an election-related claim to verify its authenticity.</p>
      </div>

      <form onSubmit={checkClaim} className="flex flex-col gap-4 mb-10 bg-white p-6 rounded-xl shadow-sm border">
        <label htmlFor="claim-input" className="font-semibold text-gray-800">Claim to verify</label>
        <textarea
          id="claim-input"
          ref={inputRef}
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g. You can vote on WhatsApp in India."
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !claim.trim()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Verifying..." : "Verify Claim"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className={`p-6 rounded-xl border shadow-sm ${result.is_true ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`} aria-live="polite">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-2xl ${result.is_true ? 'text-green-600' : 'text-red-600'}`}>
              {result.is_true ? '✅' : '❌'}
            </span>
            <h2 className={`text-2xl font-bold ${result.is_true ? 'text-green-800' : 'text-red-800'}`}>
              {result.is_true ? 'Likely True' : 'Likely False'}
            </h2>
          </div>
          <p className="text-gray-800 leading-relaxed bg-white p-4 rounded-lg shadow-sm border opacity-90">
            <strong>Explanation:</strong> {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
