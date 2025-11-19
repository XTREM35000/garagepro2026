"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './splash/SplashScreen';
import LandingPage from './landing/LandingPage';

export default function SplashRoot({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show splash on first mount
    setIsMounted(true);

    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    }

    // Check if landing was already shown in this session
    const landingShown = sessionStorage.getItem('landingShown');
    if (landingShown) {
      setShowLanding(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');

    const landingShown = sessionStorage.getItem('landingShown');
    if (!landingShown) {
      setShowLanding(true);
    }
  };

  const handleLandingComplete = () => {
    setShowLanding(false);
    sessionStorage.setItem('landingShown', 'true');
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showLanding) {
    // If user navigated to a different route (e.g. /auth), render children instead
    if (pathname && pathname !== '/') {
      return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
    }

    return <LandingPage onClose={handleLandingComplete} />;
  }

  return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
}
