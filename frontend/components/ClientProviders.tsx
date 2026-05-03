"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Background3D = dynamic(() => import("./Background3D"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[-1] bg-gray-50" /> 
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          {mounted && <Background3D />}
          {children}
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
