"use client"

import React from 'react'
import Image from 'next/image'

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
  return (
    <div className={`mt-1 w-full rounded-3xl overflow-hidden shadow relative ${mobileHeight} ${desktopHeight} ${className}`}>
      <Image src={image} alt={alt} fill sizes="100%" className="w-full h-full object-cover" />

      <div className="absolute inset-0 flex items-end">
        <div className="p-4 md:p-6 w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
