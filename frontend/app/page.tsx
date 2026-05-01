export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-20">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
        Navigate Elections with <span className="text-blue-600">Confidence</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-12">
        BallotBuddy AI provides reliable, easy-to-understand guidance on voting rules, election timelines, and fact-checks misinformation in real-time.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        <a href="/chat" className="bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-300 hover:shadow-md transition-all text-left block focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="text-3xl mb-3">💬</div>
          <h2 className="text-xl font-bold mb-2">AI Assistant</h2>
          <p className="text-gray-600">Ask any question about the upcoming elections and get immediate, verified answers.</p>
        </a>
        
        <a href="/guide" className="bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-300 hover:shadow-md transition-all text-left block focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="text-3xl mb-3">🗺️</div>
          <h2 className="text-xl font-bold mb-2">Personalized Guide</h2>
          <p className="text-gray-600">Enter your role (e.g. student, voter) to get a tailored step-by-step voting plan.</p>
        </a>
        
        <a href="/timeline" className="bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-300 hover:shadow-md transition-all text-left block focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="text-3xl mb-3">📅</div>
          <h2 className="text-xl font-bold mb-2">Election Timeline</h2>
          <p className="text-gray-600">Track all important dates from registration to certification.</p>
        </a>
        
        <a href="/misinformation" className="bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-300 hover:shadow-md transition-all text-left block focus:outline-none focus:ring-2 focus:ring-blue-500">
          <div className="text-3xl mb-3">🛡️</div>
          <h2 className="text-xl font-bold mb-2">Fact Checker</h2>
          <p className="text-gray-600">Verify suspicious claims instantly with our AI misinformation checker.</p>
        </a>
      </div>
    </div>
  );
}
