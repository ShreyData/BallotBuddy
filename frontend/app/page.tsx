"use client";

import nextDynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MessageSquare, MapPin, Calendar, Smartphone, ShieldCheck, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

const ReadinessScore = nextDynamic(() => import("../components/ReadinessScore"), { ssr: false });

const HERO_FEATURES = [
  { icon: <MessageSquare />, title: "AI Assistant", desc: "Expert guidance in English & Hindi", link: "/chat", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: <Smartphone />, title: "EVM Practice", desc: "Interactive voting simulator", link: "/evm", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: <MapPin />, title: "Booth Locator", desc: "Find your polling station", link: "/booth", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: <Calendar />, title: "Timeline", desc: "Track key election dates", link: "/timeline", color: "text-amber-600", bg: "bg-amber-50" },
];

interface TrendingTopic {
  topic: string;
  count: number;
}

export default function Home() {
  const { data: trending = [] } = useQuery<TrendingTopic[]>({
    queryKey: ["trending"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/trending`);
      if (!response.ok) throw new Error("Failed to fetch trending topics");
      return response.json();
    },
    refetchInterval: 60000,
  });

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          AI-Powered Election Guide 2026
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
        >
          Navigate Elections with <span className="text-blue-600">Total Confidence</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          BallotBuddy AI provides reliable guidance on ECI rules, practice modules for EVMs, and real-time booth location tracking.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Link href="/chat">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              Start AI Chat
            </button>
          </Link>
          <Link href="/evm">
            <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all">
              Practice Voting
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Trending Topics & Features Grid */}
      <section className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/20 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Trending Now</h3>
            </div>
            <div className="space-y-4">
              {trending.length > 0 ? trending.map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors truncate">
                    {item.topic}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    {item.count} Questions
                  </p>
                </div>
              )) : (
                ["How to register?", "Find my booth", "EVM VVPAT guide"].map((topic, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {topic}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      Popular
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
          {HERO_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Link href={feature.link}>
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all h-full group">
                  <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-gray-900">Your Journey to the Booth</h2>
            <p className="text-gray-600">
              We&apos;ve mapped out every step you need to take. Use the readiness tracker to stay on top of your preparation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/40 border border-white/20 rounded-2xl space-y-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <p className="text-xs font-bold text-gray-900 uppercase">Verified Data</p>
              <p className="text-[10px] text-gray-500">Sourced directly from official ECI guidelines.</p>
            </div>
            <div className="p-4 bg-white/40 border border-white/20 rounded-2xl space-y-2">
              <Globe className="w-5 h-5 text-purple-600" />
              <p className="text-xs font-bold text-gray-900 uppercase">Multi-Lingual</p>
              <p className="text-[10px] text-gray-500">Support for English, Hindi, and regional languages.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ReadinessScore />
        </div>
      </section>
    </div>
  );
}
