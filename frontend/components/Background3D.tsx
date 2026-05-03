"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./Scene'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[-1] bg-gray-50" />
});

export default function Background3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-[-1] bg-gray-50" />;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Scene />
    </div>
  );
}
