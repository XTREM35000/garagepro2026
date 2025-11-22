export default function DataTableMobile({ rows }: { rows: any[] }) {
  return (
    <div className="space-y-3 md:hidden">
      {rows.map((row, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow border space-y-1">
          {Object.entries(row).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="font-medium text-gray-500">{key}</span>
              <span className="text-gray-900">{String(value)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
