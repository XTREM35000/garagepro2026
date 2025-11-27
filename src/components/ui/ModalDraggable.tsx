'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalDraggableProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  draggable?: boolean;
  maxWidth?: string;
}

export function ModalDraggable({
  isOpen,
  onClose,
  title,
  children,
  draggable = true,
  maxWidth = 'max-w-lg'
}: ModalDraggableProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!draggable) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !ref.current) return;
      const ox = ref.current.dataset.offsetX ? Number(ref.current.dataset.offsetX) : 0;
      const oy = ref.current.dataset.offsetY ? Number(ref.current.dataset.offsetY) : 0;
      posRef.current.x = e.clientX - ox;
      posRef.current.y = e.clientY - oy;
      const x = posRef.current.x;
      const y = posRef.current.y;
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggable]);

  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (!draggable || !ref.current) return;
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
            className={`relative z-10 ${maxWidth} w-[min(96%,100%)] max-h-[85vh] rounded-lg bg-white dark:bg-gray-900 flex flex-col shadow-lg`}
            style={{ touchAction: 'none', overflow: 'hidden' }}
          >
            {(title || draggable) && (
              <div
                onMouseDown={onHeaderMouseDown}
                className="cursor-grab active:cursor-grabbing rounded-t-lg bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-white flex-shrink-0 select-none flex items-center justify-between"
              >
                <h3 className="text-sm font-medium">{title || ''}</h3>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="ml-4 rounded-md bg-white/20 px-2 py-1 hover:bg-white/30 transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="overflow-hidden flex-1 p-4">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
