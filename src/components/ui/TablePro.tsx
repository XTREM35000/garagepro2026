export default function TablePro({ columns, data }: { columns: string[]; data: any[][] }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200">
      <table className="w-full bg-white">
        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="px-4 py-3 text-left font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri} className="hover:bg-gray-50 transition">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 border-t">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
