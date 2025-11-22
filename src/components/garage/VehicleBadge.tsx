import { Car } from "lucide-react";

export default function VehicleBadge({ plate, status }: { plate: string; status: string }) {
  const statusColor = {
    "en_attente": "bg-orange-100 text-orange-700",
    "atelier": "bg-blue-100 text-blue-700",
    "pret": "bg-green-100 text-green-700",
    "livre": "bg-emerald-100 text-emerald-700",
  }[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
      <Car size={14} />
      {plate.toUpperCase()}
    </span>
  );
}
