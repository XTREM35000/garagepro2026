export default function TableProMobile({ rows, onClick }: any) {
  return (
    <div className="grid gap-3">
      {rows.map((row: any, i: number) => (
        <div
          key={i}
          onClick={() => onClick?.(row)}
          className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-soft cursor-pointer"
        >
          {Object.keys(row).map((k) => (
            <div key={k} className="text-sm flex justify-between py-1">
              <span className="font-medium text-gray-500">{k}</span>
              <span>{row[k]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
