import { Map } from '@/components/dashboard/Map';
import { TruckCard } from '@/components/dashboard/TruckCard';
import { EmergencyAlert } from '@/components/dashboard/EmergencyAlert';
import { trucks } from '@/lib/data';

export default function TrackingPage() {
  const alertTruck = trucks.find((t) => t.unauthorizedDoorOpening);
  
  return (
    <div className="space-y-6">
      {alertTruck && (
        <EmergencyAlert
          truckId={alertTruck.id}
          truckLocation={`${alertTruck.location.lat},${alertTruck.location.lng}`}
        />
      )}

      <Map trucks={trucks} />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold font-headline">Active Fleet</h2>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {trucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
        </div>
      </div>
    </div>
  );
}
