import React from 'react'

export default function DamageSelector({ onAdd }: { onAdd: (d: any) => void }) {
  const [loc, setLoc] = React.useState('')
  const [type, setType] = React.useState('RAYURE')
  const [gravite, setGravite] = React.useState('LEGERE')

  return (
    <div>
      <div className="flex gap-2">
        <input value={loc} onChange={e => setLoc(e.target.value)} placeholder="Localisation" className="border rounded px-2 py-1 flex-1" />
        <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1">
          <option>RAYURE</option>
          <option>BOSSE</option>
          <option>CASSE</option>
        </select>
        <select value={gravite} onChange={e => setGravite(e.target.value)} className="border rounded px-2 py-1">
          <option>LEGERE</option>
          <option>MOYENNE</option>
          <option>GRAVE</option>
        </select>
      </div>
      <div className="mt-2 flex gap-2">
        <button className="btn" onClick={() => { if (!loc) return; onAdd({ localisation: loc, type, gravite }); setLoc('') }}>Ajouter</button>
      </div>
    </div>
  )
}
