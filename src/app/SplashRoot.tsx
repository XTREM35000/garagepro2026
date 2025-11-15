"use client";

import React, { useState, useEffect } from 'react';
import SplashScreen from './splash/SplashScreen';

export default function SplashRoot({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only show splash on first mount
    setIsMounted(true);

    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
  }

  return showSplash ? (
    <SplashScreen onComplete={handleSplashComplete} />
  ) : (
    <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>
  );
}
