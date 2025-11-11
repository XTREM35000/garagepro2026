"use client";

import React, { useState } from 'react';
import SplashScreen from './splash/SplashScreen';

export default function SplashRoot({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <SplashScreen onComplete={() => setShowSplash(false)} />
  ) : (
    <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>
  );
}
