import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BallotBuddy AI",
  description: "Your intelligent election companion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
        <header className="bg-white shadow-sm py-4 px-6 border-b">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              🗳️ BallotBuddy AI
            </a>
            <nav>
              <ul className="flex gap-6 font-medium text-gray-600">
                <li><a href="/chat" className="hover:text-blue-600 focus:outline-none focus:underline">Chat</a></li>
                <li><a href="/guide" className="hover:text-blue-600 focus:outline-none focus:underline">Guide</a></li>
                <li><a href="/timeline" className="hover:text-blue-600 focus:outline-none focus:underline">Timeline</a></li>
                <li><a href="/misinformation" className="hover:text-blue-600 focus:outline-none focus:underline">Fact Check</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
          {children}
        </main>
        <footer className="text-center py-6 text-gray-500 text-sm">
          © 2026 BallotBuddy AI. Built with Clean Architecture.
        </footer>
      </body>
    </html>
  );
}
