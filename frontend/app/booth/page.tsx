"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Info } from "lucide-react";

const BoothLocator = dynamic(() => import("../../components/BoothLocator"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-[32px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  )
});

export default function BoothPage() {
  return (
    <div className="space-y-8 py-8 max-w-5xl mx-auto">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3 h-3" />
          Interactive Station Finder
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Locate Your <span className="text-emerald-600">Polling Station</span>
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Use the interactive map below to find your nearest polling booth. Enter your area or constituency to see verified locations provided by ECI data.
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
            <BoothLocator />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-tight">
              <Info className="w-4 h-4" />
              Quick Tips
            </div>
            <ul className="space-y-3 text-sm text-blue-800/80 leading-relaxed">
              <li>• Bring your Voter ID or alternative identity proof.</li>
              <li>• Check your part number in the electoral roll.</li>
              <li>• Polling hours: 7:00 AM to 6:00 PM.</li>
            </ul>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200/60">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Need help?</p>
            <p className="text-sm text-gray-600 mb-4">Can&apos;t find your booth? Ask our AI assistant for guidance on registration.</p>
            <a href="/chat" className="text-sm font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
              Go to Chat &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
