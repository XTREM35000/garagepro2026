/**
 * logo-animated.tsx
 * Simple inline SVG animated logo (no external assets required)
 */
import React from 'react'

export default function LogoAnimated({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" strokeDasharray="1 10">
        <animate attributeName="stroke-dashoffset" from="0" to="100" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="50" y="55" textAnchor="middle" fontSize="28" fill="#0f172a" fontFamily="sans-serif">S</text>
    </svg>
  )
}
