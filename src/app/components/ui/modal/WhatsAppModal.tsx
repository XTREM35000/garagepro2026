"use client";

import React, { useState } from "react";
import BaseModal from "./BaseModal";

export default function WhatsAppModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const openWhatsApp = () => {
    const text = encodeURIComponent(message || "Bonjour, j'ai une question concernant ma réparation.");
    const number = phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${number}?text=${text}`;
    window.open(url, "_blank");
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Envoyer un message WhatsApp">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Numéro</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="33612345678"
          className="w-full rounded-md border px-3 py-2"
        />

        <label className="text-sm font-medium">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[100px] rounded-md border px-3 py-2"
          placeholder="Bonjour, je souhaite..."
        />

        <div className="flex justify-end">
          <button
            onClick={openWhatsApp}
            className="inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Ouvrir WhatsApp
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
