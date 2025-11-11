/**
 * confirm-modal.tsx
 * Small confirm modal component that uses BaseModal
 */
import React from 'react'
import BaseModal from './base-modal'

export default function ConfirmModal({ open, onClose, onConfirm, title = 'Confirmer', children }: { open: boolean; onClose: () => void; onConfirm: () => void; title?: string; children?: React.ReactNode }) {
  return (
    <BaseModal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>{children}</div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn">Annuler</button>
          <button onClick={onConfirm} className="btn btn-primary">Confirmer</button>
        </div>
      </div>
    </BaseModal>
  )
}
