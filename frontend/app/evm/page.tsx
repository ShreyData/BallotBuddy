"use client";

import nextDynamic from "next/dynamic";

const EVMSimulator = nextDynamic(() => import("../../components/EVMSimulator"), { ssr: false });



export default function EVMPage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">EVM & VVPAT Simulation</h1>
        <p className="text-lg text-gray-600">
          Experience the voting process before you head to the polling booth. 
          Practice makes you a more confident and informed voter.
        </p>
      </div>

      <EVMSimulator />

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white/60 p-6 rounded-3xl border border-white/20 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Step 1: Press Button</h3>
          <p className="text-sm text-gray-600">Press the blue button against the candidate of your choice on the Ballot Unit.</p>
        </div>
        <div className="bg-white/60 p-6 rounded-3xl border border-white/20 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Step 2: Hear Beep</h3>
          <p className="text-sm text-gray-600">A red light will glow next to the candidate&apos;s symbol and a long beep will sound.</p>
        </div>
        <div className="bg-white/60 p-6 rounded-3xl border border-white/20 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Step 3: Verify Slip</h3>
          <p className="text-sm text-gray-600">Check the VVPAT window. A slip with your candidate&apos;s details will be visible for 7 seconds.</p>
        </div>
      </div>
    </div>
  );
}
