export default function ListRow({ title, subtitle, right }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {right && <div className="text-gray-700">{right}</div>}
    </div>
  )
}
