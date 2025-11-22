export default function VehicleBadge({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">{label}</span>
  )
}
