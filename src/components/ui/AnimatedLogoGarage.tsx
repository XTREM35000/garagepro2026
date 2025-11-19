"use client";

import React from 'react';
import AnimatedLogo from '@/app/components/AnimatedLogo';

type Props = {
  size?: number;
  small?: boolean;
  animated?: boolean;
  showText?: boolean;
  className?: string;
};

export default function AnimatedLogoGarage({ size = 88, small = false, animated = true, showText = false, className = '' }: Props) {
  return (
    <AnimatedLogo size={size} small={small} animated={animated} showText={showText} className={className} />
  );
}

export { AnimatedLogoGarage };
