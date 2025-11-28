"use client";

import React, { useState } from "react";
import { Plus, Trash2, AlertCircle, Package } from "lucide-react";

interface BesoinPiecesProps {
  interventionId?: string;
  onPiecesChange?: (pieces: any[]) => void;
}

export default function BesoinPieces({
  interventionId,
  onPiecesChange,
}: BesoinPiecesProps) {
  const [pieces, setPieces] = useState<any[]>([]);
  const [stockItems] = useState([
    { id: "1", nom: "Filtre à air", stock: 5, prix: 2500 },
    { id: "2", nom: "Plaquettes freins", stock: 2, prix: 15000 },
    { id: "3", nom: "Liquide moteur (5L)", stock: 0, prix: 8000 },
    { id: "4", nom: "Batterie", stock: 1, prix: 45000 },
  ]);

  const addPiece = (itemId: string) => {
    const item = stockItems.find((s) => s.id === itemId);
    if (item) {
      const newPiece = {
        id: Date.now(),
        itemId,
        nom: item.nom,
        quantite: 1,
        prixUnitaire: item.prix,
        stock: item.stock,
      };
      const updated = [...pieces, newPiece];
      setPieces(updated);
      onPiecesChange?.(updated);
    }
  };

  const removePiece = (id: number) => {
    const updated = pieces.filter((p) => p.id !== id);
    setPieces(updated);
    onPiecesChange?.(updated);
  };

  const updateQuantite = (id: number, quantite: number) => {
    const updated = pieces.map((p) =>
      p.id === id ? { ...p, quantite: Math.max(1, quantite) } : p
    );
    setPieces(updated);
    onPiecesChange?.(updated);
  };

  const totalPrix = pieces.reduce((sum, p) => sum + p.prixUnitaire * p.quantite, 0);
  const ruptures = pieces.filter((p) => p.quantite > p.stock);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Package size={20} className="text-blue-500" />
        <h3 className="text-lg font-semibold">Pièces Nécessaires</h3>
      </div>

      {/* Ajouter pièce */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Ajouter pièce du stock</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {stockItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addPiece(item.id)}
              className={`
                p-3 text-left rounded-lg border text-sm transition-all
                ${item.stock === 0
                  ? "opacity-50 cursor-not-allowed border-red-200 dark:border-red-800"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
              disabled={item.stock === 0}
            >
              <p className="font-semibold">{item.nom}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Stock: {item.stock} | {item.prix.toLocaleString()} FCFA
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Pièces sélectionnées */}
      {pieces.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-semibold">Pièces sélectionnées</h4>

          {ruptures.length > 0 && (
            <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-800 dark:text-red-200">
                  ⚠️ Rupture de stock détectée
                </p>
                <p className="text-red-700 dark:text-red-300">
                  {ruptures.map((p) => `${p.nom} (besoin: ${p.quantite}, stock: ${p.stock})`).join(", ")}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm">{piece.nom}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {piece.prixUnitaire.toLocaleString()} FCFA/unité
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantite(piece.id, piece.quantite - 1)}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={piece.quantite}
                    onChange={(e) =>
                      updateQuantite(piece.id, parseInt(e.target.value) || 1)
                    }
                    className="w-12 text-center border rounded px-2 py-1 dark:bg-gray-600 dark:border-gray-500"
                    min="1"
                  />
                  <button
                    onClick={() => updateQuantite(piece.id, piece.quantite + 1)}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold text-sm w-24 text-right">
                  {(piece.prixUnitaire * piece.quantite).toLocaleString()} FCFA
                </p>

                <button
                  onClick={() => removePiece(piece.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total pièces:</span>
            <span className="text-lg text-blue-600 dark:text-blue-400">
              {totalPrix.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      )}

      {pieces.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          Aucune pièce sélectionnée
        </p>
      )}
    </div>
  );
}
