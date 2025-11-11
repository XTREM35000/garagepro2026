/**
 * draggable-modal-wrapper.tsx
 * Wrapper that provides a simple trigger and manages open state for DraggableModal.
 * Usage: <DraggableModalWrapper triggerLabel="Ouvrir">Contenu</DraggableModalWrapper>
 */
import React, { useState } from 'react'
import DraggableModal from './draggable-modal'

type Props = {
  triggerLabel?: string
  children?: React.ReactNode
}

export default function DraggableModalWrapper({ triggerLabel = 'Ouvrir', children }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-3 py-1 rounded bg-sky-500 text-white">
        {triggerLabel}
      </button>
      <DraggableModal open={open} onClose={() => setOpen(false)}>
        {children}
      </DraggableModal>
    </>
  )
}
