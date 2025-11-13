"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";
import { payslipSchema, type PayslipInput } from "@/lib/modal-schemas";

type PayslipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PayslipInput) => void | Promise<void>;
  initialData?: Partial<PayslipInput>;
};

export default function PayslipModal({ isOpen, onClose, onSubmit, initialData }: PayslipModalProps) {

  // The zod resolver may treat fields with defaults as optional in the inferred resolver types.
  // To avoid type incompatibilities between react-hook-form generics and the resolver, we
  // accept a form value type where bonuses/deductions are optional, then normalize before
  // calling the external onSubmit which expects a full PayslipInput.
  type PayslipFormValues = Omit<PayslipInput, "bonuses" | "deductions"> & {
    bonuses?: number;
    deductions?: number;
  };

  const form = useForm<PayslipFormValues>({
    resolver: zodResolver(payslipSchema),
    defaultValues: {
      employeeName: initialData?.employeeName ?? "",
      employeeEmail: initialData?.employeeEmail ?? "",
      salary: initialData?.salary ?? 0,
      month: initialData?.month ?? "",
      bonuses: initialData?.bonuses ?? 0,
      deductions: initialData?.deductions ?? 0,
    },
  });

  const {
    register: reg,
    handleSubmit: handleSub,
    formState: { errors: formErrors, isSubmitting: formIsSubmitting },
    reset: formReset,
    watch: formWatch,
  } = form;

  // keep backwards-compatible names used below
  const errors = formErrors;
  const isSubmitting = formIsSubmitting;
  const reset = formReset;
  const watch = formWatch;

  React.useEffect(() => {
    if (isOpen) {
      // reset expects the form value type; cast initialData accordingly
      reset(initialData as unknown as PayslipFormValues);
    }
  }, [isOpen, initialData, reset]);

  const salary = watch("salary") ?? 0;
  const bonuses = watch("bonuses") ?? 0;
  const deductions = watch("deductions") ?? 0;
  const net = salary + bonuses - deductions;

  const handleFormSubmit: SubmitHandler<PayslipFormValues> = async (data) => {
    // Normalize optional fields to the full PayslipInput shape
    const payload: PayslipInput = {
      employeeName: data.employeeName,
      employeeEmail: data.employeeEmail,
      salary: data.salary,
      month: data.month,
      bonuses: data.bonuses ?? 0,
      deductions: data.deductions ?? 0,
    };

    await onSubmit(payload);
    reset();
    onClose();
  };

  return (
    <DraggableModal isOpen={isOpen} onClose={onClose} title="Fiche de salaire">
      <form onSubmit={handleSub(handleFormSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom de l&apos;employé</label>
          <input
            {...reg("employeeName")}
            placeholder="Ex. Jean Dupont"
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
          />
          {errors.employeeName && <p className="text-xs text-red-600 mt-1">{errors.employeeName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...reg("employeeEmail")}
            type="email"
            placeholder="jean@example.com"
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
          />
          {errors.employeeEmail && <p className="text-xs text-red-600 mt-1">{errors.employeeEmail.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mois</label>
          <input
            {...reg("month")}
            type="month"
            placeholder="2025-11"
            className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
          />
          {errors.month && <p className="text-xs text-red-600 mt-1">{errors.month.message}</p>}
        </div>

        <div className="border-t pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Salaire de base (€)</label>
              <input
                {...reg("salary", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
              />
              {errors.salary && <p className="text-xs text-red-600 mt-1">{errors.salary.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Primes (€)</label>
              <input
                {...reg("bonuses", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
              />
              {errors.bonuses && <p className="text-xs text-red-600 mt-1">{errors.bonuses.message}</p>}
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Retenues (€)</label>
            <input
              {...reg("deductions", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400"
            />
            {errors.deductions && <p className="text-xs text-red-600 mt-1">{errors.deductions.message}</p>}
          </div>
        </div>

        <div className="rounded bg-gradient-to-r from-sky-50 to-emerald-50 p-3">
          <p className="text-xs text-gray-600">Montant net à payer</p>
          <p className="text-xl font-bold text-emerald-600">{net.toFixed(2)} €</p>
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
            {isSubmitting ? "En cours..." : "Créer fiche de salaire"}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}
