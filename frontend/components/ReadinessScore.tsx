"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

const TASKS = [
  { id: "auth", label: "Login with Google", link: "/", points: 20 },
  { id: "chat", label: "Ask a question to AI", link: "/chat", points: 20 },
  { id: "evm", label: "Complete EVM Practice", link: "/evm", points: 20 },
  { id: "booth", label: "Locate your Polling Booth", link: "/booth", points: 20 },
  { id: "timeline", label: "Check Election Timeline", link: "/timeline", points: 20 },
];

export default function ReadinessScore() {
  const [mounted, setMounted] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bb_readiness_tasks");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedTasks(parsed);
          calculateScore(parsed);
        } catch (e) {
          console.error("Failed to parse readiness tasks", e);
        }
      }
    }
  }, []);

  const calculateScore = (tasks: string[]) => {
    const total = tasks.reduce((acc, taskId) => {
      const task = TASKS.find(t => t.id === taskId);
      return acc + (task?.points || 0);
    }, 0);
    setScore(total);
  };

  const toggleTask = (taskId: string) => {
    const newTasks = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(newTasks);
    calculateScore(newTasks);
    if (typeof window !== "undefined") {
      localStorage.setItem("bb_readiness_tasks", JSON.stringify(newTasks));
    }
  };

  if (!mounted) return <div className="h-[200px]" />;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-blue-100"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={364.4}
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
              className="text-blue-600"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-900">{score}%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ready</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2">
            Voter Readiness Score <Trophy className="w-5 h-5 text-amber-500" />
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Complete the steps below to ensure you&apos;re 100% prepared for election day.
          </p>
          <div className="bg-blue-50/50 rounded-2xl px-4 py-2 inline-block">
            <span className="text-xs font-bold text-blue-700">
              {score === 100 ? "🎉 You are fully prepared!" : `${100 - score}% more to go`}
            </span>
          </div>
        <div className="relative w-32 h-32 flex items-center justify-center" aria-hidden="true">
          <svg className="w-full h-full transform -rotate-90">
        ...
        <div className="space-y-3">
        {TASKS.map((task) => (
          <div
            key={task.id}
            className={`group p-4 rounded-2xl border transition-all flex items-center justify-between ${
              completedTasks.includes(task.id)
                ? "bg-green-50/50 border-green-100"
                : "bg-white/50 border-white/20 hover:border-blue-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleTask(task.id)}
                aria-label={completedTasks.includes(task.id) ? `Mark "${task.label}" as incomplete` : `Mark "${task.label}" as complete`}
              >
                {completedTasks.includes(task.id) ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 hover:text-blue-400 transition-colors" />
                )}
              </button>
              <span className={`font-medium ${completedTasks.includes(task.id) ? "text-green-700 line-through" : "text-gray-700"}`}>
                {task.label}
              </span>
            </div>
            <Link href={task.link}>
              <button 
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                aria-label={`Go to ${task.label} page`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        ))}
        </div>
    </div>
  );
}
