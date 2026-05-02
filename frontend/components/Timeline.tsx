import { TimelinePhase } from "../types/api";

interface TimelineProps {
  phases: TimelinePhase[];
}

export function Timeline({ phases }: TimelineProps) {
  if (phases.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="relative border-l-2 border-blue-200 ml-4 md:ml-6" role="list" aria-label="Election Timeline">
        {phases.map((phase, index) => (
          <div key={index} className="mb-10 ml-8 relative group" role="listitem">
            <div className="absolute -left-[41px] top-1 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-sm" aria-hidden="true"></div>
            <h3 className="text-xl font-bold text-gray-900" aria-label={`Phase ${index + 1}: ${phase.phase}`}>{phase.phase}</h3>
            <p className="mt-2 text-gray-600">{phase.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
