"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ModalDraggable } from "@/components/ui/ModalDraggable";
import { Plus, X } from "lucide-react";
import ClientSearch from "./ClientSearch";
import VehicleForm from "./VehicleForm";

interface ReceptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ReceptionForm({
  isOpen,
  onClose,
  onSubmit,
}: ReceptionFormProps) {
  const [step, setStep] = useState<"client" | "vehicle" | "photos" | "confirm">(
    "client"
  );
  const [clientData, setClientData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [photoData, setPhotoData] = useState<any[]>([]);

  const handleClientNext = (data: any) => {
    setClientData(data);
    setStep("vehicle");
  };

  const handleVehicleNext = (data: any) => {
    setVehicleData(data);
    setStep("photos");
  };

  const handlePhotoNext = (data: any) => {
    setPhotoData(data);
    setStep("confirm");
  };

  const handleConfirm = () => {
    onSubmit({
      client: clientData,
      vehicle: vehicleData,
      photos: photoData,
      timestamp: new Date(),
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep("client");
    setClientData(null);
    setVehicleData(null);
    setPhotoData([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ModalDraggable
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Nouvelle Réception"
    >
      <div className="space-y-6 p-6">
        {/* Progress Indicators */}
        <div className="flex gap-2 justify-between mb-6">
          {["client", "vehicle", "photos", "confirm"].map((s, idx) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${step === s || (idx < ["client", "vehicle", "photos", "confirm"].indexOf(step))
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-gray-600"
                }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {step === "client" && (
            <ClientSearch onNext={handleClientNext} />
          )}

          {step === "vehicle" && (
            <VehicleForm
              onNext={handleVehicleNext}
              onBack={() => setStep("client")}
            />
          )}

          {step === "photos" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Photos du Véhicule</h3>
              <p className="text-sm text-gray-500">
                Prendre 4 photos : avant, arrière, côtés gauche et droit
              </p>
              <button
                onClick={() => handlePhotoNext([])}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Continuer sans photos
              </button>
              <button
                onClick={() => setStep("confirm")}
                className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Ajouter photos (TODO)
              </button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Confirmer la Réception</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2 text-sm">
                <p>
                  <strong>Client:</strong> {clientData?.nom}
                </p>
                <p>
                  <strong>Véhicule:</strong> {vehicleData?.marque}{" "}
                  {vehicleData?.modele}
                </p>
                <p>
                  <strong>Immatriculation:</strong> {vehicleData?.immatricule}
                </p>
              </div>
              <button
                onClick={handleConfirm}
                className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirmer la Réception
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </ModalDraggable>
  );
}
