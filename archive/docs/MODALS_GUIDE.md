# 🎯 Guide d'utilisation des Modals réutilisables

Vous avez maintenant 5 modals draggables et validées. Voici comment les utiliser dans vos pages.

---

## 📦 Modals disponibles

### 1. **ConfirmModal** (Confirmation générique)
```tsx
import ConfirmModal from "@/app/components/ui/modal/ConfirmModal";

// Dans votre composant
const [confirmOpen, setConfirmOpen] = useState(false);

<ConfirmModal
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="Supprimer matériel ?"
  message="Cette action est irréversible."
  confirmText="Supprimer"
  cancelText="Annuler"
  isDangerous={true}
  onConfirm={async () => {
    await fetch(`/api/stock_materiel?id=${id}`, { method: 'DELETE' });
    // Refresh list
  }}
/>
```

### 2. **AddMaterielModal** (Ajouter/Modifier matériel)
```tsx
import AddMaterielModal from "@/app/components/modals/AddMaterielModal";
import { type AddMaterielInput } from "@/lib/modal-schemas";

const [materielOpen, setMaterielOpen] = useState(false);

<AddMaterielModal
  isOpen={materielOpen}
  onClose={() => setMaterielOpen(false)}
  onSubmit={async (data: AddMaterielInput) => {
    await fetch('/api/stock_materiel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    // Refresh
  }}
/>
```

### 3. **ModifyVehicleModal** (Modifier fiche véhicule)
```tsx
import ModifyVehicleModal from "@/app/components/modals/ModifyVehicleModal";
import { type ModifyVehicleInput } from "@/lib/modal-schemas";

const [vehicleOpen, setVehicleOpen] = useState(false);

<ModifyVehicleModal
  isOpen={vehicleOpen}
  onClose={() => setVehicleOpen(false)}
  initialData={{
    immatricule: "AB-123-CD",
    marque: "Renault",
    modele: "Clio",
    status: "EN_COURS"
  }}
  onSubmit={async (data: ModifyVehicleInput) => {
    await fetch('/api/vehicles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }}
/>
```

### 4. **PayslipModal** (Fiche de salaire)
```tsx
import PayslipModal from "@/app/components/modals/PayslipModal";
import { type PayslipInput } from "@/lib/modal-schemas";

const [payslipOpen, setPayslipOpen] = useState(false);

<PayslipModal
  isOpen={payslipOpen}
  onClose={() => setPayslipOpen(false)}
  initialData={{
    employeeName: "Jean Dupont",
    employeeEmail: "jean@garage.com",
    month: "2025-11"
  }}
  onSubmit={async (data: PayslipInput) => {
    // POST to your payroll API
    console.log("Fiche créée:", data);
    // Récupérer NET = salary + bonuses - deductions
  }}
/>
```

### 5. **DraggableModal** (Modal générique draggable)
```tsx
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";

<DraggableModal
  isOpen={isOpen}
  onClose={() => setOpen(false)}
  title="Titre de la modal"
>
  <div>Contenu personnalisé</div>
</DraggableModal>
```

---

## ✨ Caractéristiques communes

- ✅ **Draggable** : Cliquer/drag le header pour déplacer
- ✅ **React Hook Form** : Gestion du form avancée (sauf BaseModal et ConfirmModal)
- ✅ **Zod validation** : Schémas TypeScript-first
- ✅ **Framer Motion** : Animations fluides
- ✅ **Responsive** : Mobile-friendly
- ✅ **Accessible** : ARIA labels et focus management

---

## 🔧 Schémas Zod disponibles

Tous les schémas sont dans `src/lib/modal-schemas.ts` :

```typescript
import {
  confirmationModalSchema,
  addMaterielSchema,
  modifyVehicleSchema,
  payslipSchema,
  type ConfirmationModalInput,
  type AddMaterielInput,
  type ModifyVehicleInput,
  type PayslipInput,
} from "@/lib/modal-schemas";
```

---

## 📋 Exemple complet : Stock page avec modals

Voir `src/app/dashboard/stock_materiel/page.tsx` pour un exemple complet d'intégration.

Remplacer le code actuel pour ajouter modals :

```tsx
'use client';

import { useState } from 'react';
import AddMaterielModal from '@/app/components/modals/AddMaterielModal';
import ConfirmModal from '@/app/components/ui/modal/ConfirmModal';
import { type AddMaterielInput } from '@/lib/modal-schemas';

export default function StockPage() {
  const [materielOpen, setMaterielOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    await fetch(`/api/stock_materiel?id=${toDelete}`, { method: 'DELETE' });
    setToDelete(null);
    // Refresh
  };

  return (
    <div className="p-6">
      {/* ... */}
      
      <button 
        onClick={() => setMaterielOpen(true)}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        + Ajouter matériel
      </button>

      <AddMaterielModal
        isOpen={materielOpen}
        onClose={() => setMaterielOpen(false)}
        onSubmit={async (data: AddMaterielInput) => {
          await fetch('/api/stock_materiel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          // Refresh list
        }}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Supprimer ce matériel ?"
        message="Cette action est irréversible."
        isDangerous={true}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
```

---

## 💡 Tips d'utilisation

1. **Réutiliser** : Toutes les modals sont réutilisables. Vous pouvez les importer dans n'importe quelle page.
2. **Valider** : Les schémas Zod vérifient types + contraintes métier.
3. **Customizer** : Modifier les schémas dans `src/lib/modal-schemas.ts` si besoin.
4. **Estétique** : Utiliser gradients (sky-600, emerald-600) pour cohérence visuelle.
5. **Async** : `onSubmit` est async-ready pour appels API.

---

## 🚀 Prochaines étapes

1. Intégrer ces modals dans vos pages CRUD existantes
2. Créer des API endpoints correspondants si nécessaire
3. Tester drag & drop + validation des forms
4. Ajouter plus de modals en suivant le même pattern

Bon développement ! 🎉
