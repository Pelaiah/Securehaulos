'use client';
import React, { Children, cloneElement } from 'react';

// This layout is now handled by the main dashboard layout.
// This file is kept to avoid breaking Next.js routing, but it just passes children through.
export default function ShipperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
