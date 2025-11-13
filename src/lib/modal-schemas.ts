import { z } from 'zod'

// Schémas de validation pour les modals

export const confirmationModalSchema = z.object({
  title: z.string().min(1, 'Title required'),
  message: z.string().min(1, 'Message required'),
  confirmText: z.string().default('Confirmer'),
  cancelText: z.string().default('Annuler'),
})

export const addMaterielSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  categorie: z.string().min(1, 'Catégorie requise'),
  quantite: z.number().int().min(1, 'Quantité minimum 1'),
  prixAchat: z.number().positive('Prix achat doit être positif'),
  prixVente: z.number().positive('Prix vente doit être positif'),
  seuilAlerte: z.number().int().min(0, 'Seuil minimum 0'),
})

export const modifyVehicleSchema = z.object({
  immatricule: z.string().min(1, 'Immatricule requis'),
  marque: z.string().min(1, 'Marque requise'),
  modele: z.string().min(1, 'Modèle requis'),
  status: z.enum(['EN_COURS', 'TERMINE', 'LIVRE']),
})

export const payslipSchema = z.object({
  employeeName: z.string().min(1, 'Nom de l\'employé requis'),
  employeeEmail: z.string().email('Email invalide'),
  salary: z.coerce.number().positive('Salaire doit être positif'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Format: YYYY-MM'),
  bonuses: z.number().min(0, 'Primes minimum 0').default(0),
  deductions: z.number().min(0, 'Retenues minimum 0').default(0),
})

export type ConfirmationModalInput = z.infer<typeof confirmationModalSchema>
export type AddMaterielInput = z.infer<typeof addMaterielSchema>
export type ModifyVehicleInput = z.infer<typeof modifyVehicleSchema>
export type PayslipInput = z.infer<typeof payslipSchema>
