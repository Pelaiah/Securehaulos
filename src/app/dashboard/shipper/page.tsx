'use client'
import { ShipperLoads } from "@/components/dashboard/ShipperLoads";

export default function ShipperDashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Shipper Dashboard</h1>
            <ShipperLoads />
        </div>
    )
}