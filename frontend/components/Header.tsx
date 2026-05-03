"use client";

import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/LanguageContext";
import { Globe } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Header() {
  const { user, signInWithGoogle, logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🗳️ BallotBuddy AI
        </Link>
        <nav className="flex items-center gap-8">
          <ul className="flex gap-6 font-medium text-gray-600">
            <li><Link href="/chat" className="hover:text-blue-600 transition-colors">{t("chat")}</Link></li>
            <li><Link href="/evm" className="hover:text-blue-600 transition-colors">{t("evm")}</Link></li>
            <li><Link href="/scenarios" className="hover:text-blue-600 transition-colors">Scenarios</Link></li>
            <li><Link href="/booth" className="hover:text-blue-600 transition-colors">{t("booth")}</Link></li>
          </ul>
          
          <div className="pl-6 border-l flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border">
              <Globe className="w-4 h-4 text-gray-400" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                className="bg-transparent text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            {mounted && (
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium hidden md:inline">
                      {user.displayName || "User"}
                    </span>
                    <button 
                      onClick={logout}
                      className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      {t("logout")}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={signInWithGoogle}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {t("login")}
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
