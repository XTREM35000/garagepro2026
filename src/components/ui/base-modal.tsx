/**
 * base-modal.tsx
 * Basic accessible modal wrapper.
 * Props: title, open, onClose, children
 */
import React from 'react'

type Props = {
  title?: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function BaseModal({ title, open, onClose, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="bg-white p-4 rounded shadow z-10 max-w-lg w-full">
        {title && <h3 className="font-semibold mb-2">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  )
}
