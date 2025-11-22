import React from "react";
import { cn } from "@/lib/utils";

export function IconButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700",
        "transition-all active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
