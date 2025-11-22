import React from "react";
import { cn } from "@/lib/utils";

export function TablePro({ columns, data }: { columns: string[]; data: any[] }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-neutral-300 dark:border-neutral-800">
      <table className="w-full border-collapse">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-neutral-200 dark:border-neutral-700">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="p-4 text-neutral-800 dark:text-neutral-200 whitespace-nowrap"
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
