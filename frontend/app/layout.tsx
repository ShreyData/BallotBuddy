import "./globals.css";
import type { Metadata } from "next";
import { Header } from "../components/Header";
import { ClientProviders } from "../components/ClientProviders";

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col relative">
        <ClientProviders>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
            {children}
          </main>
          <footer className="text-center py-6 text-gray-500 text-sm">
            © 2026 BallotBuddy AI. Built with Clean Architecture.
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}