import React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  variant?: "green" | "blue" | "orange" | "red";
  children: React.ReactNode;
  className?: string;
};

export function Badge({ variant = "green", children, className }: BadgeProps) {
  const variants = {
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 text-sm rounded-lg font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
