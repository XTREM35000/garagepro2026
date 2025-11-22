"use client";
import React from "react";
import cn from "clsx";

export default function Button({ children, variant = "primary", className = "", ...props }: any) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all";
  const variants: any = {
    primary: "px-4 py-2 bg-[hsl(var(--brand)/1)] text-white shadow-greenGlow",
    ghost: "px-3 py-2 bg-transparent border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    neutral: "px-3 py-2 bg-gray-100 text-gray-800"
  };
  return <button className={cn(base, variants[variant], className)} {...props}>{children}</button>;
}
