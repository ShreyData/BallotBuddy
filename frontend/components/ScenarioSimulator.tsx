"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight,
  User,
  ShieldAlert
} from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    is_correct: boolean;
    explanation: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "missing-name",
    title: "Missing from Electoral Roll",
    description: "You've reached your polling booth with your EPIC card, but the polling officer says your name is not on the printed electoral roll. What is your legal right?",
    options: [
      { 
        id: "1", 
        text: "Leave immediately and go home.", 
        is_correct: false, 
        explanation: "Leaving won't help you vote. You should always double-check the list or ask for the ASD list." 
      },
      { 
        id: "2", 
        text: "Ask for a 'Challenged Vote' form.", 
        is_correct: false, 
        explanation: "Challenged votes are for when your identity is questioned by an agent, not when your name is missing." 
      },
      { 
        id: "3", 
        text: "Request a 'Tendered Vote' if you find someone else already voted in your name.", 
        is_correct: true, 
        explanation: "Correct! If your identity is verified but someone else already voted as you, you can cast a Tendered Vote on a ballot paper." 
      }
    ]
  },
  {
    id: "evm-error",
    title: "EVM Malfunction",
    description: "While pressing the button, you notice the red light doesn't glow and there is no beep. What should you do?",
    options: [
      { 
        id: "1", 
        text: "Press the button repeatedly until it works.", 
        is_correct: false, 
        explanation: "Do not do this. It might record multiple attempts or cause further errors." 
      },
      { 
        id: "2", 
        text: "Inform the Presiding Officer immediately.", 
        is_correct: true, 
        explanation: "Exactly. The Presiding Officer is responsible for reporting EVM issues and arranging a replacement if needed." 
      },
      { 
        id: "3", 
        text: "Try a different candidate's button.", 
        is_correct: false, 
        explanation: "Your vote is your choice. Never change your choice due to a technical error; report it instead." 
      }
    ]
  }
];

export default function ScenarioSimulator() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentIdx];

  const handleSelect = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
    setShowResult(true);
    
    const option = scenario.options.find(o => o.id === optionId);
    if (option?.is_correct) {
      setScore(score + 1);
    }
  };

  const nextScenario = () => {
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest">
          <ShieldAlert className="w-3 h-3" />
          Critical Thinking Challenge
        </div>
        <h1 className="text-4xl font-black text-gray-900">Scenario Simulator</h1>
        <p className="text-lg text-gray-600">Test your knowledge of election day procedures and voter rights.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 md:p-12 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Scenario {currentIdx + 1} of {SCENARIOS.length}</span>
            <div className="flex gap-1">
              {SCENARIOS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIdx ? "w-8 bg-blue-600" : "w-2 bg-gray-200"}`} />
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">{scenario.title}</h2>
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
            <p className="text-gray-700 leading-relaxed italic">&quot;{scenario.description}&quot;</p>
          </div>

          <div className="space-y-4">
            {scenario.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={showResult}
                className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                  showResult 
                    ? option.is_correct
                      ? "bg-green-50 border-green-200"
                      : selectedOption === option.id
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-gray-100 opacity-50"
                    : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    showResult 
                      ? option.is_correct
                        ? "bg-green-500 text-white"
                        : selectedOption === option.id
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      : "bg-blue-50 text-blue-600"
                  }`}>
                    {option.id}
                  </div>
                  <span className={`font-semibold ${showResult ? "text-gray-900" : "text-gray-700"}`}>
                    {option.text}
                  </span>
                </div>
                {showResult && option.is_correct && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                {showResult && !option.is_correct && selectedOption === option.id && <AlertCircle className="w-6 h-6 text-red-500" />}
                {!showResult && <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />}
              </button>
            ))}
          </div>

          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-6 rounded-3xl border ${
                scenario.options.find(o => o.id === selectedOption)?.is_correct
                  ? "bg-green-50/50 border-green-100 text-green-800"
                  : "bg-red-50/50 border-red-100 text-red-800"
              }`}
            >
              <div className="flex gap-4">
                <HelpCircle className="w-6 h-6 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  <span className="font-bold">Explanation: </span>
                  {scenario.options.find(o => o.id === selectedOption)?.explanation}
                </p>
              </div>
              
              {currentIdx < SCENARIOS.length - 1 ? (
                <button 
                  onClick={nextScenario}
                  className="mt-6 flex items-center gap-2 font-bold text-sm bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-all"
                >
                  Next Scenario <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="mt-8 text-center pt-8 border-t border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Simulation Over!</h3>
                  <p className="text-gray-500 mb-6">Your readiness score has improved.</p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">
                    Score: {score}/{SCENARIOS.length}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
