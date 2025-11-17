"use client";

import React, { useState, useEffect } from 'react';
import SplashScreen from './splash/SplashScreen';
import LandingPage from './landing/LandingPage';

export default function SplashRoot({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

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
    return <LandingPage onClose={handleLandingComplete} />;
  }

  return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
}
