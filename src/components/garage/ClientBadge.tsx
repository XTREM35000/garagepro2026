import { User } from "lucide-react";

export default function ClientBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-medium">
      <User size={14} />
      {name}
    </span>
  );
}
