"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './splash/SplashScreen';
import LandingPage from './landing/LandingPage';

export default function SplashRoot({ children }: { children: React.ReactNode }) {
  // Always show splash on first mount (dev and production)
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
      // After splash is dismissed, check if landing should be shown
      const landingShown = sessionStorage.getItem('landingShown');
      if (!landingShown) {
        setShowLanding(true);
      }
      return;
    }

    // Ensure landing is shown if the app is not yet configured (server-side check).
    // This prevents the landing from being bypassed in production if the DB is empty
    // even when a client previously dismissed the landing (sessionStorage).
    (async () => {
      try {
        const res = await fetch('/api/setup/status')
        if (res.ok) {
          const data = await res.json()
          // If no super admin and no tenant admin, force show landing after splash on root path
          if (!data.superAdminExists && !data.tenantAdminExists && pathname === '/') {
            setShowLanding(true)
          }
        }
      } catch (err) {
        // ignore — default behavior preserved
      }
    })()
  }, [pathname]);

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
    return <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">{children}</div>;
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showLanding) {
    // If user navigated to a different route (e.g. /auth), render children instead
    if (pathname && pathname !== '/') {
      return <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">{children}</div>;
    }

    return <LandingPage onClose={handleLandingComplete} />;
  }

  return <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">{children}</div>;
}
