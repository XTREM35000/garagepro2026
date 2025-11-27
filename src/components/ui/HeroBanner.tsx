"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type HeroBannerProps = {
  image?: string
  alt?: string
  className?: string
  mobileHeight?: string // e.g. 'h-[200px]'
  desktopHeight?: string // e.g. 'sm:h-[300px]'
  children?: React.ReactNode
}

export default function HeroBanner({
  image = '/images/dashboard.png',
  alt = 'Hero',
  className = '',
  mobileHeight = 'h-[200px]',
  desktopHeight = 'sm:h-[300px]',
  children,
}: HeroBannerProps) {
  const router = useRouter()
  return (
    <div className={`mt-1 w-full rounded-3xl overflow-hidden shadow relative ${mobileHeight} ${desktopHeight} ${className}`}>
      <Image src={image} alt={alt} fill sizes="100%" className="w-full h-full object-cover" />

      {/* In-image Back button (top-left) */}
      <button
        onClick={() => router.back()}
        aria-label="Retour"
        className="absolute top-3 left-3 z-10 bg-white/90 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900 text-gray-900 dark:text-white rounded-full p-2 shadow transition"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="absolute inset-0 flex items-end">
        <div className="p-4 md:p-6 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
