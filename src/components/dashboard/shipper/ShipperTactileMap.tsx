'use client';

import React, { useState, useEffect } from 'react';
import { MapCN, type MapVehicle, type MapWaypoint } from '@/components/ui/MapCN';
import { cn } from '@/lib/utils';
import {
  DEFAULT_IN_TRANSIT_LOADS,
  type ShipperInTransitLoad,
} from './transitData';

interface ShipperTactileMapProps {
  selectedTruck?: ShipperInTransitLoad;
  allTrucks?: ShipperInTransitLoad[];
  onSelectTruckIndex?: (index: number) => void;
  className?: string;
}

/** Map ShipperInTransitLoad → MapVehicle expected by MapCN */
function toMapVehicle(truck: ShipperInTransitLoad, speed: number): MapVehicle {
  return {
    id: truck.id,
    name: truck.cargo,
    plate: truck.plate,
    driver: truck.driver,
    lat: 0,
    lng: 0,
    xPercent: truck.mapPin.left,
    yPercent: truck.mapPin.top,
    speed,
    heading: 135,
    status: 'In Transit',
    batteryOrFuel: 100 - truck.progress,
    routeProgress: truck.progress,
    currentCity: truck.origin,
    destinationCity: truck.destination,
    eta: truck.eta,
  };
}

/** Derive a pair of waypoints (origin + dest) for the selected truck */
function toWaypoints(truck: ShipperInTransitLoad): MapWaypoint[] {
  return [
    {
      id: `${truck.id}-origin`,
      name: truck.origin,
      city: truck.origin,
      xPercent: truck.mapPin.originCoords.left,
      yPercent: truck.mapPin.originCoords.top,
      type: 'pickup',
      completed: true,
    },
    {
      id: `${truck.id}-dest`,
      name: truck.destination,
      city: truck.destination,
      xPercent: truck.mapPin.destCoords.left,
      yPercent: truck.mapPin.destCoords.top,
      type: 'dropoff',
      completed: false,
    },
  ];
}

export function ShipperTactileMap({
  selectedTruck = DEFAULT_IN_TRANSIT_LOADS[0],
  allTrucks = DEFAULT_IN_TRANSIT_LOADS,
  onSelectTruckIndex,
  className,
}: ShipperTactileMapProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Simulate live speed jitter identical to previous behaviour
  const [liveSpeed, setLiveSpeed] = useState<number>(selectedTruck.speedKmH || 84);

  useEffect(() => {
    setLiveSpeed(selectedTruck.speedKmH || 84);
    const interval = setInterval(() => {
      setLiveSpeed((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(65, Math.min(105, prev + delta));
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [selectedTruck.id, selectedTruck.speedKmH]);

  // Build vehicles list for MapCN: selected truck last so it gets full HUD
  const vehicles: MapVehicle[] = allTrucks.map((t) =>
    toMapVehicle(t, t.id === selectedTruck.id ? liveSpeed : t.speedKmH)
  );

  const waypoints: MapWaypoint[] = toWaypoints(selectedTruck);

  const handleSelectVehicle = (v: MapVehicle) => {
    const idx = allTrucks.findIndex((t) => t.id === v.id);
    if (idx !== -1) onSelectTruckIndex?.(idx);
  };

  return (
    <div
      className={cn(
        'relative bg-white border border-[#e2e4dd] rounded-[20px] overflow-hidden transition-all duration-300 flex flex-col select-none shadow-sm',
        isExpanded ? 'min-h-[580px]' : 'min-h-[420px] flex-1',
        className
      )}
    >
      <MapCN
        vehicles={vehicles}
        selectedVehicleId={selectedTruck.id}
        onSelectVehicle={handleSelectVehicle}
        waypoints={waypoints}
        showRadar
        showTelemetryHUD
        theme="light"
        height="100%"
      />
    </div>
  );
}
