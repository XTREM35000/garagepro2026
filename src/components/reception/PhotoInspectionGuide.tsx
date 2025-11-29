import React from 'react'

type Zone = {
  key: string
  label: string
}

const ZONES: Zone[] = [
  { key: 'AVANT', label: 'Avant' },
  { key: 'ARRIERE', label: 'Arrière' },
  { key: 'COTE_GAUCHE', label: 'Côté gauche' },
  { key: 'COTE_DROIT', label: 'Côté droit' },
  { key: 'INTERIEUR', label: 'Intérieur' },
  { key: 'TABLEAU_BORD', label: 'Tableau de bord' },
  { key: 'COFFRE', label: 'Coffre' },
  { key: 'CAPOT', label: 'Capot' },
]

export default function PhotoInspectionGuide({ onChange }: { onChange?: (zone: string, file?: File) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ZONES.map(z => (
        <label key={z.key} className="border rounded p-2 flex flex-col items-start">
          <div className="font-medium">{z.label}</div>
          <input
            aria-label={z.label}
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={(e) => onChange && onChange(z.key, e.target.files?.[0])}
          />
        </label>
      ))}
    </div>
  )
}
