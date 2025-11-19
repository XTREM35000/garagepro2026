// AnimatedLogo avancé pour SaaS Multi-Garages
// Conçu pour Next.js + Prisma + Supabase
// Développeur : Thierry Gogo
// Contact : 2250103644527 / 2250758966156 — 2024dibo@gmail.com

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Wrench, Cog } from "lucide-react";



interface AnimatedLogoProps {
  size?: number; // px (base square)
  small?: boolean; // compact header variant
  showText?: boolean; // affiche le texte à côté
  mainColor?: string; // tailwind color classes (ex: 'text-yellow-500')
  metalColor?: string; // ex: 'text-gray-700'
  accentColor?: string; // ex: 'text-blue-400'
  animated?: boolean; // enable internal animation
  className?: string;
}

export const AnimatedLogo = ({
  size = 88,
  small = false,
  showText = false,
  mainColor = "text-yellow-500",
  metalColor = "text-gray-700",
  accentColor = "text-blue-400",
  animated = true,
  className = "",
}: AnimatedLogoProps) => {
  // Respect user preference for reduced motion
  const shouldReduce = useReducedMotion() || !animated;

  // Sizes for icons relative to container
  const containerSize = small ? Math.max(40, Math.round(size * 0.6)) : size;
  const wrenchSize = Math.round(containerSize * 0.6);
  const cogSize = Math.round(containerSize * 0.34);
  const tireSize = Math.round(containerSize * 0.9);

  // animation variants
  const bob = shouldReduce
    ? { y: 0 }
    : { y: [0, -6, 0], transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } };

  const rotateContinuous = shouldReduce
    ? { rotate: 0 }
    : { rotate: [0, 360], transition: { repeat: Infinity, duration: 6, ease: "linear" } };

  const wrenchSwing = shouldReduce
    ? { rotate: 0 }
    : { rotate: [-6, 6, -6], transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" } };

  return (
    <div
      aria-label="SaaS Multi-Garages - logo animé"
      role="img"
      className={`flex items-center ${small ? "gap-2" : "gap-4"} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: containerSize, height: containerSize, perspective: 800 }}
        className="relative"
      >
        {/* Tire (outer ring) - gives strong garage feel */}
        <motion.div
          style={{ width: tireSize, height: tireSize }}
          className={`absolute inset-0 m-auto rounded-full ${accentColor} bg-opacity-10 flex items-center justify-center`}
          animate={rotateContinuous}
        >
          {/* subtle inner ring to simulate 3D depth */}
          <div className="w-[85%] h-[85%] rounded-full bg-white/4" />
        </motion.div>

        {/* Cog (offset, rotates) */}
        <motion.div
          className={`absolute top-1 left-1`}
          animate={rotateContinuous}
          style={{ width: cogSize, height: cogSize }}
        >
          <Cog className={`${metalColor} drop-shadow`} style={{ width: cogSize, height: cogSize }} strokeWidth={2.2} />
        </motion.div>

        {/* Wrench (main, center) - swings slightly */}
        <motion.div
          className="absolute inset-0 m-auto flex items-center justify-center"
          style={{ width: wrenchSize, height: wrenchSize, transformStyle: "preserve-3d" }}
          animate={wrenchSwing}
        >
          <Wrench className={`${mainColor} drop-shadow-2xl`} style={{ width: wrenchSize, height: wrenchSize }} strokeWidth={2.6} />
        </motion.div>

        {/* Tiny sparkles / stars to add premium feel */}
        <motion.span
          className={`absolute top-2 right-3 ${accentColor}`}
          animate={shouldReduce ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
          transition={!shouldReduce ? { duration: 1.6, repeat: Infinity } : undefined}
          style={{ fontSize: 10 }}
          aria-hidden
        >
          ✦
        </motion.span>
      </motion.div>

      {/* Branding text (optional) */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-extrabold text-gray-900">SaaS Multi-Garages</span>
          {/* <span className="text-xs text-gray-500">Gestion d'ateliers • Interventions • Stock • Facturation</span> */}
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;
