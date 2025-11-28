export const clients = [
  { id: 'client-1', name: 'Kouadio Serge', phone: '+225 01 23 45 67' },
  { id: 'client-2', name: 'Konan Ahou', phone: '+225 07 11 22 33' },
  { id: 'client-3', name: 'Adélaïde Traoré', phone: '+225 05 44 55 66' },
  { id: 'client-4', name: 'Bamba Ibrahim', phone: '+225 27 88 77 66' },
  { id: 'client-5', name: 'Mariam Diabaté', phone: '+225 01 99 88 77' },
]

export const equipe = [
  { id: 'tech-1', name: 'Kouadio Traoré' },
  { id: 'tech-2', name: 'Abou Ouattara' },
  { id: 'tech-3', name: 'Yao Koné' },
  { id: 'tech-4', name: 'Salif Coulibaly' },
  { id: 'tech-5', name: 'Aminata Sangaré' },
]

export function pickRandom<T>(arr: T[]) {
  if (!Array.isArray(arr) || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}
