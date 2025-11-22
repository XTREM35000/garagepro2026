import VehicleBadge from "./VehicleBadge";
import ClientBadge from "./ClientBadge";
import StatusTag from "./StatusTag";

export default function InterventionRow({ intervention }: any) {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-soft p-4 mb-3">
      <div className="flex justify-between items-center">
        <VehicleBadge plate={intervention.vehicle} status={intervention.status} />
        <StatusTag status={intervention.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ClientBadge name={intervention.client} />
        <span className="text-xs text-gray-500">{intervention.date}</span>
      </div>

      <p className="mt-3 text-sm text-gray-600">{intervention.description}</p>
    </div>
  );
}
