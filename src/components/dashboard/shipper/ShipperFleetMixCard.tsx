'use client';

import React from 'react';

export function ShipperFleetMixCard() {
  const fleetCategories = [
    {
      name: 'Trucks',
      active: 19,
      total: 22,
      activePct: 86,
      idlePct: 9,
      maintPct: 5,
    },
    {
      name: 'Cars',
      active: 16,
      total: 18,
      activePct: 89,
      idlePct: 5,
      maintPct: 6,
    },
    {
      name: 'Buses',
      active: 7,
      total: 10,
      activePct: 70,
      idlePct: 20,
      maintPct: 10,
    },
  ];

  return (
    <section className="bg-white border border-[#e2e4dd] rounded-[20px] p-4 sm:p-4.5 shadow-sm text-[#171a16] select-none">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[13.5px] font-semibold text-[#171a16]">
          Fleet mix
        </span>
      </div>

      <div className="space-y-3">
        {fleetCategories.map((cat) => (
          <div key={cat.name} className="space-y-1.5">
            <div className="flex justify-between items-center text-[12.5px]">
              <b className="font-semibold text-[#171a16]">{cat.name}</b>
              <span className="text-[#82877c] text-[11.5px]">
                {cat.active} active · {cat.total} total
              </span>
            </div>

            {/* Segmented bar */}
            <div className="h-1.5 w-full rounded-full bg-[#e2e4dd] overflow-hidden flex">
              <div
                style={{ width: `${cat.activePct}%` }}
                className="h-full bg-[#4fb583]"
                title={`Active: ${cat.activePct}%`}
              />
              <div
                style={{ width: `${cat.idlePct}%` }}
                className="h-full bg-[#b4b8ac]"
                title={`Idle: ${cat.idlePct}%`}
              />
              <div
                style={{ width: `${cat.maintPct}%` }}
                className="h-full bg-[#e7b8a3]"
                title={`Maintenance: ${cat.maintPct}%`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3.5 mt-4 pt-3 border-t border-[#f2f3ef] text-[11px] text-[#82877c]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4fb583]" /> Active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#b4b8ac]" /> Idle
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#e7b8a3]" /> Maintenance
        </span>
      </div>
    </section>
  );
}
