"use client";
import { useState, useRef, useEffect } from "react";

export const dynamic = "force-dynamic";

import { apiService } from "../../services/api";
import { MisinformationResponse } from "../../types/api";
import { Loader } from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck } from "lucide-react";



export default function MisinformationPage() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<MisinformationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const checkClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    if (!user) {
      setError("Please login with Google to use the Fact Checker.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await apiService.checkMisinformation(claim);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to verify claim.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          ECI Fact-Checking Protocol
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Misinformation Fact Checker</h1>
        <p className="text-lg text-gray-600">Paste an election-related claim to verify its authenticity instantly.</p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-[32px] mb-10 text-center">
          <p className="text-amber-800 font-medium mb-6">Login is required for misinformation verification.</p>
          <button 
            onClick={signInWithGoogle}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            Login with Google
          </button>
        </div>
      )}

      <form onSubmit={checkClaim} className="flex flex-col gap-6 mb-12 bg-white/60 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/20">
        <label htmlFor="claim-input" className="text-sm font-bold text-gray-500 uppercase tracking-tighter ml-2">Claim to verify</label>
        <textarea
          id="claim-input"
          ref={inputRef}
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g. Can I vote by mail if I am a student living in another city?"
          className="w-full p-6 bg-white border border-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[160px] shadow-inner text-lg leading-relaxed"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !claim.trim()}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-100"
          >
            {isLoading ? "Verifying..." : "Verify Claim"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-2xl mb-8 border border-red-200" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className={`p-8 rounded-[40px] border-2 shadow-xl ${result.is_true ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`} aria-live="polite">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${result.is_true ? 'bg-green-500' : 'bg-red-500'}`}>
              {result.is_true ? '✓' : '✗'}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verification Result</p>
              <h2 className={`text-2xl font-black ${result.is_true ? 'text-green-900' : 'text-red-900'}`}>
                {result.is_true ? 'Highly Credible' : 'Likely Misinformation'}
              </h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm leading-relaxed text-gray-700 italic">
            <strong>Detailed Explanation:</strong> {result.explanation}
          </div>
        </div>
      )}
    </div>
  );
}
