interface StepCardProps {
  stepNumber: number;
  content: string;
}

export function StepCard({ stepNumber, content }: StepCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border flex gap-4 items-start hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center" aria-hidden="true">
        {stepNumber}
      </div>
      <div className="text-gray-800 pt-2 text-lg">
        {content}
      </div>
    </div>
  );
}
