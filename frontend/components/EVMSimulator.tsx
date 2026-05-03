"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RefreshCcw, Info, Play } from "lucide-react";

const CANDIDATES = [
  { id: 1, name: "Candidate A", party: "Party 1", symbol: "☀" },
  { id: 2, name: "Candidate B", party: "Party 2", symbol: "🌙" },
  { id: 3, name: "Candidate C", party: "Party 3", symbol: "⭐" },
  { id: 4, name: "NOTA", party: "None of the Above", symbol: "✖" },
];

export default function EVMSimulator() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"intro" | "voting" | "vvpat" | "done">("intro");
  const [selectedCandidate, setSelectedCandidate] = useState<typeof CANDIDATES[0] | null>(null);
  const [vvpatTimer, setVvpatTimer] = useState(7);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "vvpat" && vvpatTimer > 0) {
      timer = setTimeout(() => setVvpatTimer(vvpatTimer - 1), 1000);
    } else if (step === "vvpat" && vvpatTimer === 0) {
      setStep("done");
    }
    return () => clearTimeout(timer);
  }, [step, vvpatTimer]);

  const handleVote = (candidate: typeof CANDIDATES[0]) => {
    setSelectedCandidate(candidate);
    setStep("vvpat");
    setVvpatTimer(7);
  };

  const reset = () => {
    setStep("intro");
    setSelectedCandidate(null);
    setVvpatTimer(7);
  };

  if (!mounted) return <div className="min-h-[400px]" />;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interactive EVM Practice</h2>
          <p className="text-gray-600">Familiarize yourself with the voting process</p>
        </div>
        {step !== "intro" && (
          <button 
            onClick={reset} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Reset EVM Simulator"
          >
            <RefreshCcw className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 fill-current" />
            </div>
            <h3 className="text-xl font-bold mb-4">How to Vote in India</h3>
            <div className="max-w-md mx-auto text-left space-y-4 mb-8">
              {[
                "Identify your candidate on the Ballot Unit",
                "Press the blue button next to their name/symbol",
                "A red light will glow and a long beep will sound",
                "Verify your vote on the VVPAT screen for 7 seconds",
              ].map((text, i) => (
                <div key={i} className="flex gap-3 text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm">{text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("voting")}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Start Practice Demo
            </button>
          </motion.div>
        )}

        {step === "voting" && (
          <motion.div
            key="voting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-gray-100 rounded-3xl p-6 border-4 border-gray-200">
              <div className="bg-gray-200 px-4 py-2 rounded-xl mb-4 text-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ballot Unit</span>
              </div>
              <div className="space-y-3">
                {CANDIDATES.map((c) => (
                  <div key={c.id} className="bg-white p-3 rounded-2xl flex items-center justify-between border border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center text-sm font-bold text-gray-400">{c.id}</span>
                      <div className="text-2xl">{c.symbol}</div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{c.party}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleVote(c)}
                      className="w-12 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all active:scale-90 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label={`Press blue button to vote for ${c.name} from ${c.party}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div 
                className="bg-gray-800 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center text-center text-white relative overflow-hidden"
                role="status"
                aria-label="Control Unit: Ready to record vote"
              >
                <div className="w-4 h-4 rounded-full bg-red-500/20 mb-4 animate-pulse" />
                <h4 className="font-bold mb-2">Control Unit</h4>
                <p className="text-xs text-gray-400">Ready to record vote</p>
                <div className="absolute top-0 right-0 p-4">
                  <Info className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                  Practice pressing the blue button next to your preferred candidate on the left.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === "vvpat" && selectedCandidate && (
          <motion.div
            key="vvpat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-12"
            role="log"
            aria-live="assertive"
          >
            <div className="bg-gray-200 p-8 rounded-[40px] border-8 border-gray-300 shadow-inner mb-8">
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white w-48 h-64 p-6 shadow-xl rounded-sm border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center"
              >
                <div className="text-4xl mb-4" aria-hidden="true">{selectedCandidate.symbol}</div>
                <p className="font-black text-xl text-gray-900 mb-1">{selectedCandidate.name}</p>
                <p className="text-xs text-gray-500 mb-4">{selectedCandidate.party}</p>
                <div className="mt-auto pt-4 border-t w-full text-[10px] text-gray-300 uppercase tracking-tighter">
                  VVPAT SLIP • SECURE VOTE
                </div>
              </motion.div>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 mb-2">VVPAT Verification</p>
              <p className="text-sm text-gray-600" aria-live="polite">The slip for {selectedCandidate.name} will be visible for {vvpatTimer} more seconds</p>
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Practice Complete!</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You&apos;ve successfully simulated the voting process. On election day, your vote will be recorded just like this.
            </p>
            <button
              onClick={reset}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
