"use client";
import React from "react";

export default function TablePro({ columns = [], data = [] }: any) {
  return (
    <div className="rounded-2xl overflow-hidden border card">
      <table className="table-pro w-full">
        <thead>
          <tr>
            {columns.map((c: any, i: number) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, ri: number) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-white/95"}>
              {row.map((cell: any, ci: number) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

