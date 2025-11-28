'use client';

import * as React from 'react';
import { X, GripVertical } from 'lucide-react';

interface DraggableModalProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function ModalDraggable({
  trigger,
  title,
  description,
  children,
  open = true,
  onOpenChange,
  className
}: DraggableModalProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [scrollStart, setScrollStart] = React.useState({ y: 0, scrollTop: 0 });
  const [modalSize, setModalSize] = React.useState({ width: 0, height: 0 });

  const modalRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Update modal size when it opens and reset position
  React.useEffect(() => {
    if (open && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setModalSize({ width: rect.width, height: rect.height });
      // Reset position to center when opening
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // Handle drag start - from anywhere on the modal
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't start drag if clicking on a button, input, or interactive element
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('[role="tab"]')
    ) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle scroll start
  const handleScrollMouseDown = (e: React.MouseEvent) => {
    if (contentRef.current) {
      setIsScrolling(true);
      setScrollStart({
        y: e.clientY,
        scrollTop: contentRef.current.scrollTop
      });
    }
  };

  // Handle mouse move
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newY = e.clientY - dragStart.y;

        // Allow more movement - let modal go off-screen at top and bottom
        const viewportHeight = window.innerHeight;
        const modalHeight = modalSize.height || 400;

        // Allow dragging modal to go up above viewport and down below
        const maxY = modalHeight / 2; // Can drag past bottom
        const minY = -(modalHeight / 2 + viewportHeight); // Can drag past top

        setPosition({
          x: 0, // No horizontal movement
          y: Math.max(minY, Math.min(newY, maxY))
        });
      } else if (isScrolling && contentRef.current) {
        const deltaY = e.clientY - scrollStart.y;
        contentRef.current.scrollTop = scrollStart.scrollTop - deltaY;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsScrolling(false);
    };

    if (isDragging || isScrolling) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isScrolling, dragStart, scrollStart, position, modalSize]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={() => onOpenChange?.(false)}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed top-1/2 left-1/2 z-50 flex flex-col w-full max-w-lg border border-gray-200 bg-white dark:bg-gray-900 shadow-lg rounded-lg duration-200 cursor-grab active:cursor-grabbing${className ? ` ${className}` : ''}`}
        style={{
          transform: `translate(-50%, calc(-50% + ${position.y}px))`,
          maxHeight: 'min(95vh, auto)',
          overflow: 'hidden',
          userSelect: isDragging ? 'none' : 'auto'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle */}
        <div
          data-drag-handle
          className={`flex items-center justify-between p-6 pb-0 flex-shrink-0 transition-colors ${isDragging
            ? 'bg-gray-100 dark:bg-gray-800'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
        >
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => onOpenChange?.(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none flex-shrink-0"
              aria-label="Fermer"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
        </div>

        {/* Content - No scrollbar, auto-height */}
        <div
          ref={contentRef}
          className="px-6 pb-6 overflow-hidden"
          onMouseDown={handleScrollMouseDown}
        >
          {children}
        </div>
      </div>
    </>
  );
}

