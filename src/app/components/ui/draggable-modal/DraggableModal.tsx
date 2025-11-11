"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type DraggableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

export default function DraggableModal({ isOpen, onClose, title, children }: DraggableModalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !ref.current) return;
      posRef.current.x = e.clientX - (ref.current.dataset.offsetX ? Number(ref.current.dataset.offsetX) : 0);
      posRef.current.y = e.clientY - (ref.current.dataset.offsetY ? Number(ref.current.dataset.offsetY) : 0);
      ref.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    dragging.current = true;
    const rect = ref.current.getBoundingClientRect();
    ref.current.dataset.offsetX = String(e.clientX - rect.left);
    ref.current.dataset.offsetY = String(e.clientY - rect.top);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div
            ref={ref}
            className="relative z-10 w-[min(96%,720px)] rounded-lg bg-white p-0 shadow-lg dark:bg-gray-900"
            style={{ touchAction: "none" }}
          >
            <div
              onMouseDown={onHeaderMouseDown}
              className="cursor-grab rounded-t-lg bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{title}</h3>
                <button aria-label="Close" onClick={onClose} className="ml-4 rounded-md bg-white/20 px-2 py-1 text-sm">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
