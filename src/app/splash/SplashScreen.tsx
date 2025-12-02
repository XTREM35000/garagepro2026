// src/app/splash/SplashScreen.tsx - Version unifiée
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AnimatedLogo from '../components/AnimatedLogo';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 6000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-page overflow-y-auto"
        >
          <div className="bg-card-solid rounded-2xl p-8 shadow-lg border border-base text-center max-w-sm">
            {/* Photo de profil */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="mb-4 flex justify-center"
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-base shadow-lg">
                <Image
                  src="/images/profile01.png"
                  alt="Thierry Gogo"
                  fill
                  sizes="(max-width: 768px) 112px, 112px"
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Nom et titre */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-xs text-muted mb-1">
                De par votre serviteur :
              </p>
              <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                Thierry Gogo
              </h1>
              <p className="text-sm text-secondary mb-2 leading-tight">
                Informaticien Développeur FullStack
              </p>
              <p className="text-base font-semibold text-green-600 dark:text-green-400">
                225 0758966156
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              className="my-4 h-px bg-gray-200 dark:bg-gray-700 origin-center"
            />

            {/* Logo de la plateforme */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="mb-3 flex justify-center"
            >
              <AnimatedLogo size={56} />
            </motion.div>

            {/* Titre plateforme */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              className="text-xl font-bold text-green-600 dark:text-green-400 mb-1"
            >
              Multi-Garage-Connect (MGC)
            </motion.h2>

            {/* Sous-titre */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
              className="text-xs text-secondary mb-6"
            >
              Gestion GaragePro professionnelle
            </motion.p>

            {/* Barre de progression */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: duration / 1000, ease: "linear", delay: 1.2 }}
              className="w-40 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden"
            >
              <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600" />
            </motion.div>

            {/* Texte de chargement */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-xs text-muted mt-3"
            >
              Chargement...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;