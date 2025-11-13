"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";
import { modifyVehicleSchema, type ModifyVehicleInput } from "@/lib/modal-schemas";

type ModifyVehicleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ModifyVehicleInput) => void | Promise<void>;
  initialData?: Partial<ModifyVehicleInput>;
};

export default function ModifyVehicleModal({ isOpen, onClose, onSubmit, initialData }: ModifyVehicleModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ModifyVehicleInput>({
    resolver: zodResolver(modifyVehicleSchema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: ModifyVehicleInput) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} title="Modifier fiche véhicule">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Immatriculation</label>
          <input
            {...register("immatricule")}
            placeholder="Ex. AB-123-CD"
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
          />
          {errors.immatricule && <p className="text-xs text-red-600 mt-1">{errors.immatricule.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Marque</label>
            <input
              {...register("marque")}
              placeholder="Ex. Renault"
              className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {errors.marque && <p className="text-xs text-red-600 mt-1">{errors.marque.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Modèle</label>
            <input
              {...register("modele")}
              placeholder="Ex. Clio"
              className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {errors.modele && <p className="text-xs text-red-600 mt-1">{errors.modele.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">État</label>
          <select {...register("status")} className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400">
            <option value="EN_COURS">En cours de réparation</option>
            <option value="TERMINE">Réparation terminée</option>
            <option value="LIVRE">Livré au client</option>
          </select>
          {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2 hover:bg-gray-100">
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {isSubmitting ? "En cours..." : "Mettre à jour"}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
