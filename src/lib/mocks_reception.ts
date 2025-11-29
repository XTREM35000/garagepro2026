export type Client = {
  id: string
  nom: string
  prenom?: string
  email?: string
  telephone?: string
  adresse?: string
}

export type Vehicle = {
  id: string
  immatriculation: string
  vin?: string
  marque?: string
  modele?: string
  annee?: number
}

export type Reception = {
  id: string
  numeroBT: string
  dateReception: string
  clientId: string
  vehicleId: string
  receptionnisteId: string
  motifVisite: string
  urgence: string
  statut: string
}

// Mock data
export const mockClients: Client[] = [
  { id: 'c1', nom: 'Dupont', prenom: 'Jean', telephone: '0601020304', email: 'jean.dupont@example.com' },
  { id: 'c2', nom: 'Martin', prenom: 'Claire', telephone: '0605060708', email: 'claire.martin@example.com' },
]

export const mockVehicles: Vehicle[] = [
  { id: 'v1', immatriculation: 'AB-123-CD', vin: 'VIN1234567890', marque: 'Peugeot', modele: '308', annee: 2018 },
  { id: 'v2', immatriculation: 'EF-456-GH', vin: 'VIN0987654321', marque: 'Renault', modele: 'Clio', annee: 2020 },
]

export const mockReceptions: Reception[] = [
  {
    id: 'r1',
    numeroBT: 'BT-2025-001',
    dateReception: new Date().toISOString(),
    clientId: 'c1',
    vehicleId: 'v1',
    receptionnisteId: 'u1',
    motifVisite: 'Révision',
    urgence: 'NORMALE',
    statut: 'EN_COURS',
  },
]

export function createReception(payload: Partial<Reception>): Reception {
  const id = `r${Math.random().toString(36).slice(2, 9)}`
  const now = new Date().toISOString()
  const rec: Reception = {
    id,
    numeroBT: payload.numeroBT ?? `BT-${Date.now()}`,
    dateReception: payload.dateReception ?? now,
    clientId: payload.clientId ?? mockClients[0].id,
    vehicleId: payload.vehicleId ?? mockVehicles[0].id,
    receptionnisteId: payload.receptionnisteId ?? 'u1',
    motifVisite: payload.motifVisite ?? 'Non spécifié',
    urgence: payload.urgence ?? 'NORMALE',
    statut: payload.statut ?? 'EN_COURS',
  }
  mockReceptions.push(rec)
  return rec
}

export function deleteReception(id: string) {
  const idx = mockReceptions.findIndex(r => r.id === id)
  if (idx !== -1) mockReceptions.splice(idx, 1)
}
