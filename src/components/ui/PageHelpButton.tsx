'use client';

import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { resolveHelpMessage } from '@/lib/helpMessages';

interface PageHelpButtonProps {
  message?: string;
  className?: string;
}

export function PageHelpButton({ message, className = '' }: PageHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const helpMessage = message || resolveHelpMessage(pathname);

  return (
    <>
      {/* Help Button - Positioned top right */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-20 right-6 z-40 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${className}`}
        aria-label="Aide contextuelle"
        title="Aide sur cette page"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Overlay Help Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Help Card */}
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-sky-600 to-emerald-500">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Aide</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {helpMessage}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
                <a
                  href="/help"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-medium hover:shadow-lg transition-all text-center"
                >
                  Voir plus
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
