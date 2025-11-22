import React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 p-3",
        "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white",
        "focus:ring-2 focus:ring-green-600 outline-none",
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
