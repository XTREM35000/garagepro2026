"use client";

import React, { useState } from "react";
import { Users, X } from "lucide-react";

interface AffectationTechnicienProps {
  technicianId?: string;
  onTechnicianChange?: (id: string) => void;
}

export default function AffectationTechnicien({
  technicianId,
  onTechnicianChange,
}: AffectationTechnicienProps) {
  const [technicians] = useState([
    { id: "1", nom: "Ali Diallo", specialite: "Mécanique générale" },
    { id: "2", nom: "Moussa Sow", specialite: "Électricité auto" },
    { id: "3", nom: "Aminata Ba", specialite: "Climatisation" },
  ]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-blue-500" />
        <h3 className="text-lg font-semibold">Affectation Technicien</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {technicians.map((tech) => (
          <button
            key={tech.id}
            onClick={() => onTechnicianChange?.(tech.id)}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${technicianId === tech.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            <p className="font-semibold">{tech.nom}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{tech.specialite}</p>
          </button>
        ))}
      </div>

      {technicianId && (
        <button
          onClick={() => onTechnicianChange?.("")}
          className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
        >
          <X size={16} />
          Désaffecter
        </button>
      )}
    </div>
  );
}
