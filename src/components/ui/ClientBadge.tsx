export default function ClientBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs">
        {name.charAt(0)}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}
