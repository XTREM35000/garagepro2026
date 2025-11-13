"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";
import { addMaterielSchema, type AddMaterielInput } from "@/lib/modal-schemas";

type AddMaterielModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddMaterielInput) => void | Promise<void>;
  initialData?: Partial<AddMaterielInput>;
};

export default function AddMaterielModal({ isOpen, onClose, onSubmit, initialData }: AddMaterielModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddMaterielInput>({
    resolver: zodResolver(addMaterielSchema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: AddMaterielInput) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} title="Ajouter/Modifier matériel">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom du matériel</label>
          <input
            {...register("nom")}
            placeholder="Ex. Vis M6"
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
          />
          {errors.nom && <p className="text-xs text-red-600 mt-1">{errors.nom.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <input
            {...register("categorie")}
            placeholder="Ex. Quincaillerie"
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
          />
          {errors.categorie && <p className="text-xs text-red-600 mt-1">{errors.categorie.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Quantité</label>
            <input
              {...register("quantite", { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {errors.quantite && <p className="text-xs text-red-600 mt-1">{errors.quantite.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Seuil alerte</label>
            <input
              {...register("seuilAlerte", { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {errors.seuilAlerte && <p className="text-xs text-red-600 mt-1">{errors.seuilAlerte.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Prix d&apos;achat (€)</label>
            <input
              {...register("prixAchat", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {errors.prixAchat && <p className="text-xs text-red-600 mt-1">{errors.prixAchat.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix de vente (€)</label>
            <input
              {...register("prixVente", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {errors.prixVente && <p className="text-xs text-red-600 mt-1">{errors.prixVente.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 hover:bg-gray-100">
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSubmitting ? "En cours..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
