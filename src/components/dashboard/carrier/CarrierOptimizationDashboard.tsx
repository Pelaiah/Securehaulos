'use client';

import React, { useState } from 'react';
import { CarrierAIHeader } from './CarrierAIHeader';
import { FleetSidebar, DEFAULT_FLEET_TRUCKS, type FleetTruckItem } from './FleetSidebar';
import { CargoOptimizationCanvas } from './CargoOptimizationCanvas';
import { PermittedBoxesSidebar, DEFAULT_PERMITTED_BOXES, type PermittedBoxItem } from './PermittedBoxesSidebar';
import { CarrierBottomAnalyticsDock } from './CarrierBottomAnalyticsDock';

interface CarrierOptimizationDashboardProps {
  initialTrucks?: any[];
}

export function CarrierOptimizationDashboard({ initialTrucks }: CarrierOptimizationDashboardProps) {
  const [trucks, setTrucks] = useState<FleetTruckItem[]>(DEFAULT_FLEET_TRUCKS);
  const [selectedTruck, setSelectedTruck] = useState<FleetTruckItem>(DEFAULT_FLEET_TRUCKS[0]);
  const [boxes, setBoxes] = useState<PermittedBoxItem[]>(DEFAULT_PERMITTED_BOXES);

  // Toggle box allocation into trailer
  const handleToggleBox = (boxToToggle: PermittedBoxItem) => {
    setBoxes((prev) =>
      prev.map((b) => (b.id === boxToToggle.id ? { ...b, isAllocated: !b.isAllocated } : b))
    );
  };

  const handleClearManifest = () => {
    setBoxes((prev) => prev.map((b) => ({ ...b, isAllocated: false })));
  };

  const handleSearchAi = (query: string) => {
    // Client-side quick filter simulation
    if (!query) {
      setTrucks(DEFAULT_FLEET_TRUCKS);
      return;
    }
    const q = query.toLowerCase();
    const filtered = DEFAULT_FLEET_TRUCKS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.plate.toLowerCase().includes(q) ||
        t.compatibilityTags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.destination.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
    );
    if (filtered.length > 0) {
      setTrucks(filtered);
      setSelectedTruck(filtered[0]);
    }
  };

  const allocatedBoxes = boxes.filter((b) => b.isAllocated);

  return (
    <div className="flex flex-col h-screen w-full bg-[#F7F8F6] text-[#1C1E21] overflow-hidden">
      {/* ── HEADER BAR ── */}
      <CarrierAIHeader
        onSearchQuery={handleSearchAi}
        activeTruckCount={trucks.filter((t) => t.status === 'In Transit').length}
        totalTruckCount={trucks.length}
      />

      {/* ── 3-COLUMN ASYMMETRIC CONTENT STAGE ── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left: Fleet Assets Manifest */}
        <FleetSidebar
          trucks={trucks}
          selectedTruckId={selectedTruck.id}
          onSelectTruck={setSelectedTruck}
        />

        {/* Center Hero: Cargo Optimization Trailer Simulator */}
        <CargoOptimizationCanvas
          truckName={selectedTruck.name}
          truckPlate={selectedTruck.plate}
          maxWeightLbs={selectedTruck.totalCapacityLbs}
          allocatedBoxes={allocatedBoxes}
          onToggleBox={handleToggleBox}
          onClearManifest={handleClearManifest}
        />

        {/* Right: Permitted Boxes Manifest Catalog */}
        <PermittedBoxesSidebar
          boxes={boxes}
          onToggleBox={handleToggleBox}
        />
      </div>

      {/* ── BOTTOM MODULAR ANALYTICS DOCK ── */}
      <CarrierBottomAnalyticsDock />
    </div>
  );
}
