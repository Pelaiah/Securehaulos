export const NAV_CONFIG = {
  shipper: [
    { label: 'Dashboard', href: '/dashboard/shipper' },
    { label: 'Load Board', href: '/dashboard/shipper/load-board' },
    { label: 'My Loads', href: '/dashboard/shipper/my-loads' },
    { label: 'Tracking', href: '/dashboard/shipper/tracking' },
  ],
  carrier: [
    { label: 'Dashboard', href: '/dashboard/carrier' },
    { label: 'Load Board', href: '/dashboard/carrier/load-board' },
    { label: 'My Trucks', href: '/dashboard/carrier/my-trucks' },
    { label: 'My Drivers', href: '/dashboard/carrier/my-drivers' },
  ],
  driver: [
    { label: 'Dashboard', href: '/dashboard/driver' },
    { label: 'My Loads', href: '/dashboard/driver/my-loads' },
    { label: 'Tracking', href: '/dashboard/driver/tracking' },
  ],
} as const
