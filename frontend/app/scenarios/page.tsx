"use client";

import nextDynamic from "next/dynamic";

const ScenarioSimulator = nextDynamic(() => import("../../components/ScenarioSimulator"), { ssr: false });



export default function ScenarioPage() {
  return (
    <div className="min-h-screen">
      <ScenarioSimulator />
    </div>
  );
}
