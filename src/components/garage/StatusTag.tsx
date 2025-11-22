import { Wrench, Clock, CheckCircle2 } from "lucide-react";

export default function StatusTag({ status }: { status: string }) {
  const map: Record<string, { icon: any; color: string; label: string }> = {
    "en_attente": { icon: Clock, color: "bg-gray-100 text-gray-700", label: "En attente" },
    "en_cours": { icon: Wrench, color: "bg-blue-100 text-blue-700", label: "En cours" },
    "termine": { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700", label: "Terminé" },
  };

  const s = map[status] ?? map["en_attente"];
  const Icon = s.icon as any;

  return (
    <span className={`inline-flex items-center gap-2 ${s.color} px-3 py-1 rounded-full text-xs font-medium`}>
      <Icon size={14} />
      {s.label}
    </span>
  );
}
