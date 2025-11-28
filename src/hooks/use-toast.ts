import { useState, useCallback } from 'react'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: ToastMessage = {
      ...message,
      id,
      duration: message.duration ?? 3000,
    }

    setToasts((prev) => [...prev, toast])

    // Auto-remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }, [removeToast])

  return { toasts, addToast, removeToast }
}
