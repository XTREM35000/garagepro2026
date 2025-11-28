"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";

interface InterventionWorkflowProps {
  currentStatus: string;
  onStatusChange?: (status: string) => void;
}

const statuses = [
  { id: "EN_ATTENTE", label: "En Attente", color: "gray" },
  { id: "DIAGNOSTIC", label: "Diagnostic", color: "blue" },
  { id: "EN_COURS", label: "En Cours", color: "amber" },
  { id: "TERMINE", label: "Terminée", color: "emerald" },
  { id: "FACTURE", label: "Facturée", color: "violet" },
];

export default function InterventionWorkflow({
  currentStatus,
  onStatusChange,
}: InterventionWorkflowProps) {
  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Étapes du Workflow</h3>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statuses.map((status, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const color = status.color;

          return (
            <React.Fragment key={status.id}>
              <motion.div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                  transition-all
                  ${isCompleted
                    ? `bg-${color}-500 text-white`
                    : isCurrent
                      ? `ring-2 ring-${color}-500 bg-${color}-100`
                      : `bg-gray-200 dark:bg-gray-700`
                  }
                `}
                onClick={() => onStatusChange?.(status.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <CheckCircle size={20} />
                ) : (
                  <Circle size={20} fill="currentColor" fillOpacity="0.5" />
                )}
              </motion.div>

              {idx < statuses.length - 1 && (
                <div className="flex-1 h-1 mx-1 bg-gray-200 dark:bg-gray-700" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {statuses.map((status) => {
          const isCompleted = statuses.indexOf(status) < currentIndex;
          const isCurrent = statuses.indexOf(status) === currentIndex;

          return (
            <div
              key={status.id}
              className={`
                text-center p-2 rounded-lg cursor-pointer transition-all
                ${isCurrent
                  ? `bg-${status.color}-100 dark:bg-${status.color}-900 border-2 border-${status.color}-500`
                  : isCompleted
                    ? `bg-${status.color}-50 dark:bg-${status.color}-950`
                    : "bg-gray-50 dark:bg-gray-800"
                }
              `}
              onClick={() => onStatusChange?.(status.id)}
            >
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {status.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
