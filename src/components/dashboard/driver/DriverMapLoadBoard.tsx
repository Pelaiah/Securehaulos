'use client';

import React from 'react';
import { Navigation } from 'lucide-react';
import { Map, MapRoute, MapMarker, MarkerContent, MapControls } from '@/components/ui/map';

interface DriverMapLoadBoardProps {
  onOpenControls?: () => void;
}

// LA → Phoenix via I-10 route coordinates
const LA_PHOENIX_ROUTE: [number, number][] = [
  [-118.2437, 34.0522], // Los Angeles
  [-117.8311, 33.8353], // Pomona area
  [-116.5453, 33.8298], // Palm Springs area
  [-115.5514, 32.7254], // Blythe
  [-114.6277, 32.7157], // near Yuma
  [-113.5528, 33.0745], // Tonopah
  [-112.4737, 33.4484], // Avondale
  [-112.0740, 33.4484], // Phoenix
];

export function DriverMapLoadBoard({ onOpenControls }: DriverMapLoadBoardProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-[#F7F8F6] relative">
      {/* Top Half: Real MapLibre Map */}
      <div className="relative flex-1 w-full overflow-hidden">
        <Map
          theme="light"
          center={[-115.5, 33.8]}
          zoom={5.5}
          interactive={false}
          className="h-full w-full"
        >
          {/* Route Line LA → Phoenix */}
          <MapRoute
            coordinates={LA_PHOENIX_ROUTE}
            color="#34785D"
            width={4}
            opacity={0.9}
          />

          {/* Los Angeles Marker */}
          <MapMarker longitude={-118.2437} latitude={34.0522}>
            <MarkerContent>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-white rounded-full border-4 border-[#34785D] shadow-md" />
                <span className="mt-1 text-[10px] font-bold text-[#1C1E21] uppercase tracking-wider bg-white/90 border border-[#E1E6E2] shadow-sm px-2 py-0.5 rounded-md whitespace-nowrap">
                  Los Angeles
                </span>
              </div>
            </MarkerContent>
          </MapMarker>

          {/* Phoenix Destination Marker */}
          <MapMarker longitude={-112.074} latitude={33.4484}>
            <MarkerContent>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-5 h-5 bg-[#34785D] rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[#34785D] animate-ping opacity-50" />
                </div>
                <span className="mt-1 text-[10px] font-bold text-[#1C1E21] uppercase tracking-wider bg-white/90 border border-[#E1E6E2] shadow-sm px-2 py-0.5 rounded-md whitespace-nowrap">
                  Phoenix
                </span>
              </div>
            </MarkerContent>
          </MapMarker>
        </Map>

        {/* Gradient fade into card below */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#F7F8F6] to-transparent pointer-events-none z-10" />
      </div>

      {/* Bottom: Floating Load Card */}
      <div className="w-full px-4 pb-6 pt-4 bg-[#F7F8F6] z-20">
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#E1E6E2] p-4 sm:p-5 shadow-[0_12px_36px_rgba(28,30,33,0.06)] relative overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34785D] animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-[#34785D]">IN TRANSIT · ACTIVE</span>
            </div>
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold bg-[#E8F4EE] border-[#34785D]/20 text-[#34785D] font-mono text-xs">
              #WE6K-78RFE4
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#1C1E21]">Pharmaceuticals / Cold Chain Vaccines</h3>
          <p className="text-xs text-[#6E737B] mt-0.5">
            53ft Reefer (Continuous -20°C) · <span className="font-mono text-[#1C1E21]">34,500 lbs</span>
          </p>

          {/* Timeline */}
          <div className="relative pl-5 my-4 border-l border-dashed border-[#34785D]/40 space-y-3">
            <div className="relative">
              <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 bg-[#34785D] rounded-full border-2 border-white shadow-sm" />
              <p className="text-[10px] uppercase font-bold text-[#6E737B]">Pickup</p>
              <p className="text-xs font-bold text-[#1C1E21]">Apex BioLogistics Facility #04</p>
              <p className="text-[11px] text-[#6E737B]">4200 Logistics Blvd, Dock 14, Los Angeles, CA 90040</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 bg-[#6E737B] rounded-full border-2 border-white shadow-sm" />
              <p className="text-[10px] uppercase font-bold text-[#6E737B]">Delivery</p>
              <p className="text-xs font-bold text-[#1C1E21]">Pacific Horizon Medical Center &amp; Distribution</p>
              <p className="text-[11px] text-[#6E737B]">8800 Sun Valley Parkway, Phoenix, AZ 85037</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F7F8F6] border border-[#E1E6E2] text-center my-3">
            <div>
              <span className="text-[10px] text-[#6E737B] uppercase font-semibold">Distance</span>
              <p className="text-xs font-bold text-[#1C1E21] font-mono">372.4 mi</p>
            </div>
            <div className="border-x border-[#E1E6E2]">
              <span className="text-[10px] text-[#6E737B] uppercase font-semibold">ETA</span>
              <p className="text-xs font-bold text-[#34785D] font-mono">02:45 PM</p>
            </div>
            <div>
              <span className="text-[10px] text-[#6E737B] uppercase font-semibold">Est. Payout</span>
              <p className="text-xs font-bold text-[#34785D] font-mono">$1420.00</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenControls}
            type="button"
            className="whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34785D] disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full h-12 rounded-2xl bg-[#34785D] hover:bg-[#2C644E] text-white font-bold text-xs shadow-[0_4px_16px_rgba(52,120,93,0.25)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 fill-white" />
            OPEN LIVE TRIP CONTROLS
          </button>
        </div>
      </div>
    </div>
  );
}
