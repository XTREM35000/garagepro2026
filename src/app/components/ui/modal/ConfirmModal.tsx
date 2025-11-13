"use client";

import React from "react";
import DraggableModal from "../draggable-modal/DraggableModal";
import { motion } from "framer-motion";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean; // red button for delete-like actions
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isDangerous = false,
  onConfirm,
}: ConfirmModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <p className="text-gray-700">{message}</p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded border px-4 py-2 hover:bg-gray-100 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <motion.button
            onClick={handleConfirm}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded px-4 py-2 text-white font-medium disabled:opacity-60 ${isDangerous ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
          >
            {loading ? "En cours..." : confirmText}
          </motion.button>
        </div>
      </div>
    </DraggableModal>
  );
}
