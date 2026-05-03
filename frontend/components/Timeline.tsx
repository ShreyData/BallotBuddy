import { TimelinePhase } from "../types/api";

interface TimelineProps {
  phases: TimelinePhase[];
}

export function Timeline({ phases }: TimelineProps) {
  if (phases.length === 0) return null;

  const getGoogleCalendarUrl = (phase: TimelinePhase) => {
    if (!phase.date) return "";
    const title = encodeURIComponent(`Election: ${phase.phase}`);
    const details = encodeURIComponent(phase.description);
    const dateStr = phase.date.replace(/-/g, "");
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="relative border-l-2 border-blue-200 ml-4 md:ml-6" role="list" aria-label="Election Timeline">
        {phases.map((phase, index) => (
          <div key={index} className="mb-10 ml-8 relative group" role="listitem">
            <div className="absolute -left-[41px] top-1 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-sm" aria-hidden="true"></div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900" aria-label={`Phase ${index + 1}: ${phase.phase}`}>{phase.phase}</h3>
                {phase.date && <p className="text-sm font-medium text-blue-600 mt-1">{phase.date}</p>}
                <p className="mt-2 text-gray-600">{phase.description}</p>
              </div>
              {phase.date && (
                <a 
                  href={getGoogleCalendarUrl(phase)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5 whitespace-nowrap"
                  title="Add to Google Calendar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Add to Cal
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
